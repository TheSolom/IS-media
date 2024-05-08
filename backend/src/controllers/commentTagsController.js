import validator from 'validator';

import * as commentTagsService from '../services/commentTagsService.js';
import CustomError from '../utils/errorHandling.js';

export async function getCommentTags(req, res, next) {
    const commentId = Number(req.params.commentId);

    try {
        if (!commentId || commentId < 1)
            throw new CustomError('No valid comment id is provided', 400);

        const getCommentTagsResult = await commentTagsService.getCommentTags(
            commentId
        );

        if (!getCommentTagsResult.success)
            throw new CustomError(getCommentTagsResult.message, getCommentTagsResult.status);

        res.status(getCommentTagsResult.tags.length ? 200 : 204).json({
            success: true,
            tags: getCommentTagsResult.tags
        });
    } catch (error) {
        next(error);
    }
}

export async function getTagComments(req, res, next) {
    const { tag } = req.params;
    const { lastId, limit } = req.query;

    try {
        if (!tag || !validator.isAlphanumeric(tag))
            throw new CustomError('No valid tag is provided', 400);

        if (lastId !== undefined && (lastId === null || Number.isNaN(Number(lastId)) || Number(lastId) < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getTagCommentsResult = await commentTagsService.getTagComments(
            tag,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getTagCommentsResult.success)
            throw new CustomError(getTagCommentsResult.message, getTagCommentsResult.status);

        res.status(getTagCommentsResult.comments.length ? 200 : 204).json({
            success: true,
            lastId: getTagCommentsResult.lastId,
            comments: getTagCommentsResult.comments
        });
    } catch (error) {
        next(error);
    }
}
