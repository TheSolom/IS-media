import CustomError from '../utils/errorHandling.js';
import * as postTagsService from '../services/postTagsService.js';

export async function getPostTags(req, res, next) {
    const postId = Number(req.params.postId);

    try {
        if (!postId || postId < 1)
            throw new CustomError('No valid post id is provided', 400);

        const getPostTagsResult = await postTagsService.getPostTags(
            postId
        );

        if (!getPostTagsResult.success)
            throw new CustomError(getPostTagsResult.message, getPostTagsResult.status);

        res.status(getPostTagsResult.tags.length ? 200 : 204).json({
            success: true,
            tags: getPostTagsResult.tags
        });
    } catch (error) {
        next(error);
    }
}
