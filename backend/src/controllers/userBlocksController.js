import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userBlocksService.js';

export async function getUserBlockStatus(req, res, next) {
    const userId = Number(req.params.userId);

    try {
        if (!userId || userId < 1)
            throw new CustomError('No valid blocked id is provided', 400);

        if (userId === req.userId)
            throw new CustomError('User cannot block himself', 400);

        const getUserBlocksResult = await userService.getUserBlockStatus(
            userId,
            req.userId,
        );

        if (!getUserBlocksResult.success)
            throw new CustomError(getUserBlocksResult.message, getUserBlocksResult.status);

        res.status(200).json({
            success: true,
            blockStatus: getUserBlocksResult.blockStatus,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserBlocks(req, res, next) {
    const { lastId } = req.query;
    const { limit } = req.query;

    try {
        if (lastId !== undefined && (Number.isNaN(lastId) || lastId === null || lastId < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUserBlocksResult = await userService.getUserBlocks(
            req.userId,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getUserBlocksResult.success)
            throw new CustomError(
                getUserBlocksResult.message,
                getUserBlocksResult.status
            );

        res.status(getUserBlocksResult.blocks.length ? 200 : 204).json({
            success: true,
            lastId: getUserBlocksResult.lastId,
            blocks: getUserBlocksResult.blocks,
        });
    } catch (error) {
        next(error);
    }
}

export async function postUserBlock(req, res, next) {
    const blockedId = Number(req.body.blockedId);

    try {
        if (!blockedId || blockedId < 1)
            throw new CustomError('No valid user id is provided', 400);

        if (req.userId === blockedId)
            throw new CustomError('You can not block yourself', 400);

        const postUserBlockResult = await userService.postUserBlock(
            blockedId,
            req.userId
        );

        if (!postUserBlockResult.success)
            throw new CustomError(
                postUserBlockResult.message,
                postUserBlockResult.status
            );

        res.status(201).json({
            success: true,
            message: `Successfully blocked user with id '${blockedId}' `,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUserBlock(req, res, next) {
    const blockedId = Number(req.params.blockedId);

    try {
        if (!blockedId || blockedId < 1)
            throw new CustomError('No valid user id is provided', 400);

        if (req.userId === blockedId)
            throw new CustomError('You can not unblock yourself', 400);

        const deleteUserBlockResult = await userService.deleteUserBlock(
            blockedId,
            req.userId
        );

        if (!deleteUserBlockResult.success)
            throw new CustomError(
                deleteUserBlockResult.message,
                deleteUserBlockResult.status
            );

        res.status(200).json({
            success: true,
            message: `Successfully unblocked user with id '${blockedId}' `,
        });
    } catch (error) {
        next(error);
    }
}
