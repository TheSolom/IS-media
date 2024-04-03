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
            postId: postPostResult.createPostResult.insertId,
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
