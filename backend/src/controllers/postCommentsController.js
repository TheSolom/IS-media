import CustomError from '../utils/errorHandling.js';
import * as postCommentsService from '../services/postCommentsService.js';

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

        const getPostCommentsResult = await postCommentsService.getPostComments(
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

        const postPostCommentResult = await postCommentsService.postPostComment(
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

        const updatePostCommentResult = await postCommentsService.updatePostComment(
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

        const deletePostCommentResult = await postCommentsService.deletePostComment(
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
