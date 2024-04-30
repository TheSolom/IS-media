import PostModel from '../models/postModel.js';
import PostTagsModel from '../models/postTagsModel.js';
import { postPostTags, deletePostTags } from './postTagsService.js';
import { putUserTag, deleteUserTag } from './userTagsService.js';
import isValidUrl from '../utils/isValidUrl.js';
import deleteMedia from '../utils/deleteMedia.js';
import shuffleArray from '../utils/shuffleArray.js';

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

const getTagsProbability = (tagsRows, limit) => {
    if (!tagsRows || !tagsRows.length)
        return {};

    const tagsUsageProbability = {};

    tagsRows.forEach(({ tag_id: tagId, count, probability }) => {
        tagsUsageProbability[tagId] = Math.round(probability * Math.min(count, limit));
    });

    return tagsUsageProbability;
};

const getSelectedTags = (tagsUsageProbability, limit) => {
    if (!tagsUsageProbability)
        return [];

    const selectedTags = [];

    const tagsTotalCount = Object.values(tagsUsageProbability).reduce((a, b) => a + b);

    let remainingTags = Math.min(limit, tagsTotalCount);

    // eslint-disable-next-line no-restricted-syntax
    for (const [tagId, count] of Object.entries(tagsUsageProbability)) {
        if (remainingTags >= count) {
            selectedTags.push(...Array(count).fill(tagId));
            remainingTags -= count;
        } else {
            selectedTags.push(...Array(remainingTags).fill(tagId));
            break;
        }
    }

    return selectedTags;
};

export const getSuggestedPosts = async (tagsRows, userId, limit) => {
    const postModel = new PostModel();

    try {
        if (!tagsRows)
            return {
                success: false,
                message: 'An error occurred while fetching the suggested posts',
                status: 500,
            };

        if (!tagsRows.length)
            return {
                success: false,
                message: 'No suggested posts found',
                status: 404,
            };

        const tagsProbability = getTagsProbability(tagsRows, limit);

        const selectedTags = getSelectedTags(tagsProbability, limit);

        const tagIds = shuffleArray(selectedTags);

        const [postRows] = await postModel.findSuggestedPosts(tagIds, userId, limit);

        if (!postRows.length)
            return {
                success: false,
                message: 'No suggested posts found',
                status: 404,
            };

        return {
            success: true,
            posts: postRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the suggested posts',
            status: 500,
        };
    }
};

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

export const postPost = async (title, content, tags, authorId, parentId) => {
    const postModel = new PostModel();

    try {
        const createPostResult = await postModel.create({ title, content, author_id: authorId, parent_id: parentId });

        if (!createPostResult.affectedRows)
            return {
                success: false,
                message: 'An error occurred while creating the post',
                status: 500,
            };

        const createTagsResult = await postPostTags(tags, createPostResult.insertId);

        if (!createTagsResult.success && createTagsResult.status !== 400) {
            await postModel.delete({ id: createPostResult.insertId });

            return {
                success: false,
                message: 'An error occurred while creating the post',
                status: 500,
            };
        }

        const { tagsIds } = createTagsResult;

        if (tagsIds && tagsIds.length) {
            const putUsedTagsResult = await putUserTag(tagsIds, authorId);

            if (!putUsedTagsResult.success) {
                await postModel.delete({ id: createPostResult.insertId });

                return {
                    success: false,
                    message: 'An error occurred while creating the post',
                    status: 500,
                };
            }
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

export const updatePost = async (title, content, tags, postId, authorId) => {
    const postModel = new PostModel();
    const postTagsModel = new PostTagsModel();

    try {
        const [postRow] = await postModel.find({ id: postId, author_id: authorId });

        if (!postRow.length)
            return {
                success: false,
                message: `No post found with id '${postId}' `,
                status: 404,
            };

        if (postRow[0].title === title && postRow[0].content === content)
            return {
                success: false,
                message: 'No changes detected',
                status: 200
            };

        const [postTagsRows] = await postTagsModel.find({ post_id: postId });

        if (postTagsRows.length) {
            const deleteUsedTagsResult = await deleteUserTag(postTagsRows, authorId);

            if (!deleteUsedTagsResult.success) {
                return {
                    success: false,
                    message: 'An error occurred while updating the post',
                    status: 500,
                };
            }
        }

        const deletePostTagsResult = await deletePostTags(postId);

        if (!deletePostTagsResult.success && deletePostTagsResult.status !== 404)
            return {
                success: false,
                message: 'An error occurred while updating the post',
                status: 500,
            };

        const updateResult = await postModel.update({ title, content }, { id: postId });

        if (tags) {
            const createTagsResult = await postPostTags(tags, postId);

            if (!createTagsResult.success && createTagsResult.status !== 400) {
                await postModel.update({ title: postRow[0].title, content: postRow[0].content }, { id: postId });

                return {
                    success: false,
                    message: 'An error occurred while updating the post',
                    status: 500
                };
            }

            const { tagsIds } = createTagsResult;

            if (tagsIds && tagsIds.length) {
                const putUsedTagsResult = await putUserTag(tagsIds, authorId);

                if (!putUsedTagsResult.success) {
                    await postModel.delete({ id: postId });

                    return {
                        success: false,
                        message: 'An error occurred while updating the post',
                        status: 500,
                    };
                }
            }
        }

        if (isValidUrl(postRow[0].content) && postRow[0].content !== content)
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
    const postTagsModel = new PostTagsModel();

    try {
        const [postRow] = await postModel.find({ id: postId, author_id: authorId });

        if (!postRow.length)
            return {
                success: false,
                message: `No post found with id '${postId}' `,
                status: 404,
            };

        const [postTagsRows] = await postTagsModel.find({ post_id: postId });

        if (postTagsRows.length) {
            const deleteUsedTagsResult = await deleteUserTag(postTagsRows, authorId);

            if (!deleteUsedTagsResult.success) {
                return {
                    success: false,
                    message: 'An error occurred while deleting the post',
                    status: 500,
                };
            }
        }

        const deletePostTagsResult = await deletePostTags(postId);

        if (!deletePostTagsResult.success && deletePostTagsResult.status !== 404)
            return {
                success: false,
                message: 'An error occurred while deleting the post',
                status: 500,
            };

        const deleteResult = await postModel.delete({ id: postId, author_id: authorId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No post found with id '${postId}'`,
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
