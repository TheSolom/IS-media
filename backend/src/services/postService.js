import PostModel from '../models/postModel.js';
import { postPostTags, deletePostTags } from './postTagsService.js';
import isValidUrl from '../utils/isValidUrl.js';
import deleteMedia from '../utils/deleteMedia.js';

export const getPost = async (postId) => {
    const postModel = new PostModel();

    try {
        const [postRow] = await postModel.find({ id: postId });

        if (!postRow.length)
            return {
                success: false,
                message: `No post found with id '${postId}' `,
                status: 404,
            };

        return {
            success: true,
            post: postRow[0]
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the post',
            status: 500,
        };
    }
};

export const postPost = async (title, content, authorId, parentId) => {
    const titleNormalized = title.trim();
    const contentNormalized = content.trim();

    const postModel = new PostModel();

    try {
        const createPostResult = await postModel.create({ title: titleNormalized, content: contentNormalized, author_id: authorId, parent_id: parentId });

        if (!createPostResult.affectedRows)
            return {
                success: false,
                message: 'An error occurred while creating the post',
                status: 500,
            };

        const createTagsResult = await postPostTags(titleNormalized, contentNormalized, createPostResult.insertId);

        if (!createTagsResult.success) {
            await postModel.delete({ id: createPostResult.insertId });

            return {
                success: false,
                message: createTagsResult.status === 400 ?
                    createTagsResult.message : 'An error occurred while creating the post',
                status: createTagsResult.status
            };
        }

        return {
            success: true,
            createPostResult
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while creating the post',
            status: 500,
        };
    }
};

export const updatePost = async (title, content, postId, authorId) => {
    const titleNormalized = title.trim();
    const contentNormalized = content.trim();

    const postModel = new PostModel();

    try {
        const [postRow] = await postModel.find({ id: postId, author_id: authorId });

        if (!postRow.length)
            return {
                success: false,
                message: `No post found with id '${postId}' `,
                status: 404,
            };

        if (postRow[0].title === titleNormalized && postRow[0].content === contentNormalized)
            return {
                success: false,
                message: 'No changes detected',
                status: 200
            };

        const deletePostTagsResult = await deletePostTags(postId);

        if (!deletePostTagsResult.success && deletePostTagsResult.status !== 404)
            return {
                success: false,
                message: 'An error occurred while updating the post',
                status: 500,
            };

        const updateResult = await postModel.update({ title: titleNormalized, content: contentNormalized }, { id: postId });

        const createTagsResult = await postPostTags(titleNormalized, contentNormalized, postId);

        if (!createTagsResult.success) {
            await postModel.update({ title: postRow[0].title, content: postRow[0].content }, { id: postId });

            return {
                success: false,
                message: createTagsResult.status === 400 ?
                    createTagsResult.message : 'An error occurred while updating the post',
                status: createTagsResult.status
            };
        }

        if (isValidUrl(postRow[0].content) && postRow[0].content !== contentNormalized)
            await deleteMedia(postRow[0], 'content');

        return {
            success: true,
            updateResult
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while updating the post',
            status: 500,
        };
    }
};

export const deletePost = async (postId, authorId) => {
    const postModel = new PostModel();

    try {
        const deleteResult = await postModel.delete({ id: postId, author_id: authorId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No post found with id '${postId}' for user with id '${authorId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while deleting the post',
            status: 500,
        };
    }
};

export const getFeedPosts = async (userId, lastId, limit) => {
    const postModel = new PostModel();

    try {
        const [postRows] = await postModel.findFeedPosts(userId, lastId, limit);

        const id = postRows[0] ? postRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            posts: postRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the stories',
            status: 500,
        };
    }
};

export const getUserPosts = async (userId, lastId, limit) => {
    const postModel = new PostModel();

    try {
        const [postRows] = await postModel.findUserPosts(userId, lastId, limit);

        const id = postRows[0] ? postRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            posts: postRows
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
