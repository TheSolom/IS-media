import CustomError from '../utils/errorHandling.js';
import * as userTagsService from '../services/userTagsService.js';

export async function getMostUsedTags(req, res, next) {
    const { limit } = req.query;

    try {
        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getMostUsedTagsResult = await userTagsService.getMostUsedTags(
            req.userId,
            limit ?? 5
        );

        if (!getMostUsedTagsResult.success)
            throw new CustomError(getMostUsedTagsResult.message, getMostUsedTagsResult.status);

        res.status(200).json({
            success: true,
            tags: getMostUsedTagsResult.tags,
        });
    } catch (error) {
        next(error);
    }
}
