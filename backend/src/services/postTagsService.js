import validator from 'validator';

import PostTagsModel from '../models/postTagsModel.js';
import TagsModel from '../models/tagsModel.js';
import isValidUrl from '../utils/isValidUrl.js';
import CustomError from '../utils/errorHandling.js';

export const getPostTags = async (postId) => {
    const postTagsModel = new PostTagsModel();

    try {
        const [tagsRows] = await postTagsModel.findPostTags(postId);

        return {
            success: true,
            tags: tagsRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the posts',
            status: 500,
        };
    }
};

export const getTagPosts = async (tag, lastId, limit) => {
    const postTagsModel = new PostTagsModel();

    try {
        const [postsRows] = await postTagsModel.findTagPosts(tag, lastId, limit);

        const id = postsRows[0] ? postsRows[0].post_tag_id : 0;

        return {
            success: true,
            lastId: id,
            posts: postsRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the posts',
            status: 500,
        };
    }
};

export const postPostTags = async (postTitle, postContent, postId) => {
    const tags = isValidUrl(postContent) ?
        postTitle.match(/#([^#\s]+)/g) : postContent.match(/#([^#\s]+)/g);

    if (!tags) {
        return {
            success: true,
            message: 'No tags in the post',
            status: 404,
        };
    }

    const tagsModel = new TagsModel();
    const postTagsModel = new PostTagsModel();

    try {
        const createTagsPromises = tags.map(async (tag) => {
            const tagNormalized = tag.substring(1).toLowerCase();

            if (!validator.isAlphanumeric(tagNormalized))
                return Promise.reject(new CustomError(`Tag '${tag}' is not valid, should be alphanumeric`, 400));

            const [tagRow] = await tagsModel.find({ tag: tagNormalized });

            if (tagRow.length)
                return postTagsModel.create({ tag_id: tagRow[0].id, post_id: postId });

            const createTagResult = await tagsModel.create({ tag: tagNormalized });

            return postTagsModel.create({ tag_id: createTagResult.insertId, post_id: postId });
        });

        const createPostTagsResults = await Promise.allSettled(createTagsPromises);

        const rejectedPromises = [];
        let hasCustomError = false;

        createPostTagsResults.forEach(result => {
            if (result.status === 'rejected') {
                rejectedPromises.push(result);

                if (result.reason && result.reason.status === 400)
                    hasCustomError = true;
            }
        });

        if (rejectedPromises.length) {
            console.error('Some tags failed to be added:', rejectedPromises);
            if (hasCustomError) {
                return {
                    success: false,
                    message: rejectedPromises[0].reason.message,
                    status: rejectedPromises[0].reason.status,
                };
            }

            return {
                success: false,
                message: 'Failed to add some tags to the post',
                status: 500,
            };
        }

        return {
            success: true,
            message: 'Successfully added tags to the post',
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
            status: error.status,
        };
    }
};

export const deletePostTags = async (postId) => {
    const postTagsModel = new PostTagsModel();

    try {
        const deleteResult = postTagsModel.delete({ post_id: postId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No tags found for post with id '${postId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while deleting the post tags',
            status: 500,
        };
    }
};