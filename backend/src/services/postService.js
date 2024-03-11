import PostModel from '../models/postModel.js';
import PostLikesModel from '../models/postLikesModel.js';
import PostCommentsModel from '../models/postCommentsModel.js';

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


export const postPost = async (title, content, authorId) => {
    const postModel = new PostModel();

    try {
        const createResult = await postModel.create({ title, content, author_id: authorId });

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
        const updateResult = await postModel.update({ title, content }, { id: postId, author_id: authorId });

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

export const getPostLikes = async (postId, lastId, limit) => {
    const postLikesModel = new PostLikesModel();

    try {
        const [likesRows] = await postLikesModel.findPostLikes(postId, lastId, limit);

        const id = likesRows[0] ? likesRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            likes: likesRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the likes',
            status: 500,
        };
    }
};


export const postPostLike = async (postId, userId) => {
    const postLikesModel = new PostLikesModel();

    try {
        const createResult = await postLikesModel.create({ post_id: postId, user_id: userId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `Failed to like post with id '${postId}' `,
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
            message: 'An error occurred while liking the post',
            status: 500,
        };
    }
};


export const deletePostLike = async (postId, userId) => {
    console.log('deletePostLike', postId, userId);
    const postLikesModel = new PostLikesModel();

    try {
        const deleteResult = await postLikesModel.delete({ post_id: postId, user_id: userId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No like found for user with id '${userId}' `,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while disliking the post',
            status: 500,
        };
    }
};

export const getPostComments = async (postId, lastId, limit) => {
    const postCommentsModel = new PostCommentsModel();

    try {
        const [commentsRows] = await postCommentsModel.findPostComments(postId, lastId, limit);

        const id = commentsRows[0] ? commentsRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            comments: commentsRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the comments',
            status: 500,
        };
    }
};


export const postPostComment = async (title, content, authorId, postId) => {
    const postCommentsModel = new PostCommentsModel();
    try {
        const createResult = await postCommentsModel.create({ title, content, author_id: authorId, post_id: postId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `Failed to create comment for user with id '${authorId}' `,
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
            message: 'An error occurred while creating the comment',
            status: 500,
        };
    }
};

export const updatePostComment = async (title, content, commentId, authorId) => {
    const postCommentsModel = new PostCommentsModel();

    try {
        const updateResult = await postCommentsModel.update({ title, content }, { id: commentId, author_id: authorId });

        return {
            success: true,
            updateResult
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while updating the comment',
            status: 500,
        };
    }
};

export const deletePostComment = async (commentId, authorId) => {
    const postCommentsModel = new PostCommentsModel();

    try {
        const deleteResult = await postCommentsModel.delete({ id: commentId, author_id: authorId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No comment found with id '${commentId}' for user with id '${authorId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while deleting the comment',
            status: 500,
        };
    }
};