import PostModel from '../models/postModel.js';
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
    const postModel = new PostModel();

    try {
        const createResult = await postModel.create({ title, content, author_id: authorId, parent_id: parentId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `Failed to create post for user with id '${authorId}' `,
                status: 500,
            };

        return {
            success: true,
            createResult
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
    const postModel = new PostModel();

    try {
        const [postRow] = await postModel.find({ id: postId, author_id: authorId });

        if (!postRow.length)
            return {
                success: false,
                message: `No post found with id '${postId}' `,
                status: 404,
            };

        const updateResult = await postModel.update({ title, content }, { id: postId });

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
