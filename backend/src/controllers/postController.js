import CustomError from '../utils/errorHandling.js';
import * as postService from '../services/postService.js';

export async function getPost(req, res, next) {
    const postId = Number(req.params.postId);

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        const getPostResult = await postService.getPost(postId);

        if (!getPostResult.success)
            throw new CustomError(getPostResult.message, getPostResult.status);

        res.status(200).json({
            success: true,
            post: getPostResult.post
        });
    } catch (error) {
        next(error);
    }
}

export async function postPost(req, res, next) {
    const { title, content } = req.body;
    const { parentId } = req.query;

    try {
        if (parentId !== undefined && (Number.isNaN(parentId) || parentId === null || parentId < 1))
            throw new CustomError('No valid parent id is provided', 400);

        if (!content)
            throw new CustomError('No content is provided', 400);

        const postPostResult = await postService.postPost(
            title ?? "",
            content,
            req.userId,
            parentId ?? null
        );

        if (!postPostResult.success)
            throw new CustomError(postPostResult.message, postPostResult.status);

        res.status(201).json({
            success: true,
            message: 'Successfully created post',
            postId: postPostResult.createResult.insertId,
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePost(req, res, next) {
    const { title, content } = req.body;
    const postId = Number(req.params.postId);

    try {
        if (!content)
            throw new CustomError('No content is provided', 400);

        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        const updatePostResult = await postService.updatePost(
            title ?? "",
            content,
            postId,
            req.userId
        );

        if (!updatePostResult.success)
            throw new CustomError(
                updatePostResult.message,
                updatePostResult.status
            );

        res.status(updatePostResult.updateResult.affectedRows ? 200 : 204).json({
            success: true,
            message: 'Successfully updated post',
        });
    } catch (error) {
        next(error);
    }
}

export async function deletePost(req, res, next) {
    const postId = Number(req.params.postId);

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        const deletePostResult = await postService.deletePost(
            postId,
            req.userId
        );

        if (!deletePostResult.success)
            throw new CustomError(
                deletePostResult.message,
                deletePostResult.status
            );

        res.status(200).json({
            success: true,
            message: 'Successfully deleted post',
        });
    } catch (error) {
        next(error);
    }
}

export async function getFeedPosts(req, res, next) {
    const { lastId } = req.query;
    const { limit } = req.query;

    try {
        if (lastId !== undefined && (Number.isNaN(lastId) || lastId === null || lastId < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getFeedPostsResult = await postService.getFeedPosts(
            req.userId,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getFeedPostsResult.success)
            throw new CustomError(
                getFeedPostsResult.message,
                getFeedPostsResult.status
            );

        res.status(getFeedPostsResult.posts.length ? 200 : 204).json({
            success: true,
            lastId: getFeedPostsResult.lastId,
            posts: getFeedPostsResult.posts,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserPosts(req, res, next) {
    const { userId } = req.query;
    const { lastId } = req.query;
    const { limit } = req.query;

    try {
        if (userId !== undefined && (Number.isNaN(userId) || userId === null || userId < 1))
            throw new CustomError('No valid user id is provided', 400);

        if (lastId !== undefined && (Number.isNaN(lastId) || lastId === null || lastId < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUserPostsResult = await postService.getUserPosts(
            userId ?? req.userId,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getUserPostsResult.success)
            throw new CustomError(
                getUserPostsResult.message,
                getUserPostsResult.status
            );

        res.status(getUserPostsResult.posts.length ? 200 : 204).json({
            success: true,
            lastId: getUserPostsResult.lastId,
            posts: getUserPostsResult.posts
        });
    } catch (error) {
        next(error);
    }
}

export async function getPostLikes(req, res, next) {
    const postId = Number(req.params.postId);
    const { lastId } = req.query;
    const { limit } = req.query;

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        if (lastId !== undefined && (Number.isNaN(lastId) || lastId === null || lastId < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getPostLikesResult = await postService.getPostLikes(
            postId,
            lastId ?? 0,
            limit ?? 10,
        );

        if (!getPostLikesResult.success)
            throw new CustomError(getPostLikesResult.message, getPostLikesResult.status);

        res.status(getPostLikesResult.likes.length ? 200 : 204).json({
            success: true,
            lastId: getPostLikesResult.lastId,
            likes: getPostLikesResult.likes
        });
    } catch (error) {
        next(error);
    }
}

export async function postPostLike(req, res, next) {
    const postId = Number(req.body.postId);

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        const postPostLikeResult = await postService.postPostLike(
            postId,
            req.userId
        );

        if (!postPostLikeResult.success)
            throw new CustomError(postPostLikeResult.message, postPostLikeResult.status);

        res.status(201).json({
            success: true,
            message: 'Successfully liked post',
            likeId: postPostLikeResult.createResult.insertId,
        });
    } catch (error) {
        next(error);
    }
}

export async function deletePostLike(req, res, next) {
    const postId = Number(req.params.postId);

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid postId id is provided', 400);

        const deletePostLikeResult = await postService.deletePostLike(
            postId,
            req.userId
        );

        if (!deletePostLikeResult.success)
            throw new CustomError(
                deletePostLikeResult.message,
                deletePostLikeResult.status
            );

        res.status(200).json({
            success: true,
            message: 'Successfully disliked post',
        });
    } catch (error) {
        next(error);
    }
}

export async function getPostComments(req, res, next) {
    const postId = Number(req.params.postId);
    const { lastId } = req.query;
    const { limit } = req.query;

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        if (lastId !== undefined && (Number.isNaN(lastId) || lastId === null || lastId < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getPostCommentsResult = await postService.getPostComments(
            postId,
            lastId ?? 0,
            limit ?? 10,
        );

        if (!getPostCommentsResult.success)
            throw new CustomError(getPostCommentsResult.message, getPostCommentsResult.status);

        res.status(getPostCommentsResult.comments.length ? 200 : 204).json({
            success: true,
            lastId: getPostCommentsResult.lastId,
            comments: getPostCommentsResult.comments
        });
    } catch (error) {
        next(error);
    }
}


export async function postPostComment(req, res, next) {
    const { title, content, postId } = req.body;

    try {
        if (!content)
            throw new CustomError('No content is provided', 400);
        if (!postId)
            throw new CustomError('No post id is provided', 400);

        const postPostCommentResult = await postService.postPostComment(
            title ?? "",
            content,
            req.userId,
            postId
        );

        if (!postPostCommentResult.success)
            throw new CustomError(postPostCommentResult.message, postPostCommentResult.status);

        res.status(201).json({
            success: true,
            message: 'Successfully created comment',
            commentId: postPostCommentResult.createResult.insertId,
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePostComment(req, res, next) {
    const { title, content } = req.body;
    const commentId = Number(req.params.commentId);

    try {
        if (!content)
            throw new CustomError('No content is provided', 400);

        if (!commentId || commentId < 1)
            throw new CustomError('No valid comment id is provided', 400);

        const updatePostCommentResult = await postService.updatePostComment(
            title ?? "",
            content,
            commentId,
            req.userId
        );

        if (!updatePostCommentResult.success)
            throw new CustomError(
                updatePostCommentResult.message,
                updatePostCommentResult.status
            );

        res.status(updatePostCommentResult.updateResult.affectedRows ? 200 : 204).json({
            success: true,
            message: 'Successfully updated comment',
        });
    } catch (error) {
        next(error);
    }
}

export async function deletePostComment(req, res, next) {
    const commentId = Number(req.params.commentId);

    try {
        if (!commentId || commentId < 1)
            throw new CustomError('No valid comment id is provided', 400);

        const deletePostCommentResult = await postService.deletePostComment(
            commentId,
            req.userId
        );

        if (!deletePostCommentResult.success)
            throw new CustomError(
                deletePostCommentResult.message,
                deletePostCommentResult.status
            );

        res.status(200).json({
            success: true,
            message: 'Successfully deleted comment',
        });
    } catch (error) {
        next(error);
    }
}