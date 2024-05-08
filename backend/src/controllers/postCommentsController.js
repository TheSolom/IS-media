import * as postCommentsService from '../services/postCommentsService.js';
import * as tagService from '../services/tagService.js';
import * as commentTagsService from '../services/commentTagsService.js';
import * as userTagsService from '../services/userTagsService.js';
import CustomError from '../utils/errorHandling.js';
import requestValidation from '../utils/requestValidation.js';
import isValidUrl from '../utils/isValidUrl.js';
import deleteMedia from '../utils/deleteMedia.js';

export async function getPostComment(req, res, next) {
    const commentId = Number(req.params.commentId);

    try {
        if (!commentId || commentId < 1)
            throw new CustomError('No valid comment id is provided', 400);

        const getPostCommentResult = await postCommentsService.getPostComment(commentId);

        if (!getPostCommentResult.success)
            throw new CustomError(getPostCommentResult.message, getPostCommentResult.status);

        res.status(200).json({
            success: true,
            comment: getPostCommentResult.comment
        });
    } catch (error) {
        next(error);
    }
}

export async function getPostComments(req, res, next) {
    const postId = Number(req.params.postId);
    const { lastId, limit } = req.query;

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        if (lastId !== undefined && (lastId === null || Number.isNaN(Number(lastId)) || Number(lastId) < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
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
        requestValidation(req);

        const postPostCommentResult = await postCommentsService.postPostComment(
            title,
            content,
            postId,
            req.userId,
        );

        if (!postPostCommentResult.success)
            throw new CustomError(postPostCommentResult.message, postPostCommentResult.status);

        const { insertId: commentId } = postPostCommentResult.createResult;

        const tags = await tagService.exportTags(
            title,
            content
        );

        if (tags) {
            const createTagsResult = await commentTagsService.postCommentTags(tags, commentId);

            if (!createTagsResult.success) {
                await postCommentsService.deletePostComment(commentId, req.userId);

                throw new CustomError('An error occurred while creating the comment', 500);
            }

            const { tagsIds } = createTagsResult;

            const putUsedTagsResult = await userTagsService.putUserTags(tagsIds, req.userId);

            if (!putUsedTagsResult.success) {
                await postCommentsService.deletePostComment(commentId, req.userId);

                throw new CustomError('An error occurred while creating the comment', 500);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Successfully created comment',
            commentId,
        });
    } catch (error) {
        next(error);
    }
}

// eslint-disable-next-line consistent-return
export async function updatePostComment(req, res, next) {
    const { title, content } = req.body;
    const commentId = Number(req.params.commentId);

    try {
        requestValidation(req);

        const getPostCommentResult = await postCommentsService.getPostComment(commentId);

        if (!getPostCommentResult.success)
            throw new CustomError(getPostCommentResult.message, getPostCommentResult.status);

        const { comment: currentComment } = getPostCommentResult;

        if (currentComment.author_id !== req.userId)
            throw new CustomError('You are not allowed to update this comment', 401);

        if (currentComment.title === title && currentComment.content === content)
            return res.status(200).json({
                success: true,
                message: 'No changes detected',
            });

        const getCommentTagsResult = await commentTagsService.getCommentTags(commentId);

        if (!getCommentTagsResult.success)
            throw new CustomError(getCommentTagsResult.message, getCommentTagsResult.status);

        const commentTagsIds = getCommentTagsResult.tags.map(tag => tag.tag_id);

        if (commentTagsIds.length) {
            const deleteCommentTagsResult = await commentTagsService.deleteCommentTags(commentId, commentTagsIds);

            if (!deleteCommentTagsResult.success)
                throw new CustomError('An error occurred while updating the comment', 500);

            const deleteUserTagsResult = await userTagsService.deleteUserTags(commentTagsIds, req.userId);

            if (!deleteUserTagsResult.success)
                throw new CustomError('An error occurred while updating the comment', 500);
        }

        const updatePostCommentResult = await postCommentsService.updatePostComment(
            title,
            content,
            commentId,
            req.userId
        );

        if (!updatePostCommentResult.success)
            throw new CustomError(
                updatePostCommentResult.message,
                updatePostCommentResult.status
            );

        if (isValidUrl(currentComment.content) && currentComment.content !== content)
            await deleteMedia(currentComment, 'content');

        const newTags = await tagService.exportTags(
            title,
            content
        );

        if (newTags) {
            const commentTagsResult = await commentTagsService.postCommentTags(newTags, commentId);

            if (!commentTagsResult.success) {
                await postCommentsService.updatePostComment(
                    currentComment.title,
                    currentComment.content,
                    commentId,
                );

                throw new CustomError('An error occurred while updating the comment', 500);
            }

            const { tagsIds: newTagsIds } = commentTagsResult;

            if (newTagsIds) {
                const putUsedTagsResult = await userTagsService.putUserTags(newTagsIds, req.userId);

                if (!putUsedTagsResult.success) {
                    await commentTagsService.deleteCommentTags(commentId, newTagsIds);

                    await postCommentsService.updatePost(
                        currentComment.title,
                        currentComment.content,
                        commentId,
                    );

                    throw new CustomError('An error occurred while updating the comment', 500);
                }
            }
        }

        res.status(200).json({
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

        const getPostCommentResult = await postCommentsService.getPostComment(commentId);

        if (!getPostCommentResult.success)
            throw new CustomError(getPostCommentResult.message, getPostCommentResult.status);

        const { comment: currentComment } = getPostCommentResult;

        if (currentComment.author_id !== req.userId)
            throw new CustomError('You are not allowed to delete this comment', 401);

        const getCommentTagsResult = await commentTagsService.getCommentTags(commentId);

        if (!getCommentTagsResult.success)
            throw new CustomError(getCommentTagsResult.message, getCommentTagsResult.status);

        const commentTagsIds = getCommentTagsResult.tags.map(tag => tag.tag_id);

        if (commentTagsIds.length) {
            const deletePostTagsResult = await commentTagsService.deleteCommentTags(commentId, commentTagsIds);

            if (!deletePostTagsResult.success)
                throw new CustomError('An error occurred while deleting the comment', 500);

            const deleteUserTagsResult = await userTagsService.deleteUserTags(commentTagsIds, req.userId);

            if (!deleteUserTagsResult.success)
                throw new CustomError('An error occurred while deleting the comment', 500);
        }

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
