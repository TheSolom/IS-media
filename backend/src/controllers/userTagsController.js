import CustomError from '../utils/errorHandling.js';
import * as userTagsService from '../services/userTagsService.js';

export async function getUsedTags(req, res, next) {
    const { limit } = req.query;

    try {
        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUsedTagsResult = await userTagsService.getUsedTags(
            req.userId,
            limit ?? 5
        );

        if (!getUsedTagsResult.success)
            throw new CustomError(getUsedTagsResult.message, getUsedTagsResult.status);

        res.status(200).json({
            success: true,
            tags: getUsedTagsResult.tags,
        });
    } catch (error) {
        next(error);
    }
}
