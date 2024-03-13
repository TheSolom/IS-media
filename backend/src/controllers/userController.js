import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userService.js';

export async function getUser(req, res, next) {
    const userId = Number(req.params.userId);

    try {
        if (!userId || userId < 1)
            throw new CustomError('No valid user id is provided', 400);

        const getUserResult = await userService.getUser(userId);

        if (!getUserResult.success)
            throw new CustomError(getUserResult.message, getUserResult.status);

        res.status(200).json({
            success: true,
            user: getUserResult.user,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req, res, next) {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, updating data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const getUpdateUserResult = await userService.updateUser(
            req.userId,
            req.body
        );

        if (!getUpdateUserResult.success)
            throw new CustomError(
                getUpdateUserResult.message,
                getUpdateUserResult.status
            );

        res.status(200).json({
            success: true,
            message: `Successfully updated user with id '${req.userId}' `,
        });
    } catch (error) {
        next(error);
    }
}

export async function isUserFollowee(req, res, next) {
    const followerId = Number(req.params.followerId);

    try {
        if (!followerId || followerId < 1)
            throw new CustomError('No valid follewer id is provided', 400);

        if (followerId === req.userId)
            throw new CustomError('User cannot follow himself', 400);

        const getUserFollowersResult = await userService.isUserFollowee(
            followerId,
            req.userId,
        );

        if (!getUserFollowersResult.success)
            throw new CustomError(getUserFollowersResult.message, getUserFollowersResult.status);

        res.status(200).json({
            success: true,
            isFollowing: getUserFollowersResult.isFollowing,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserFollowers(req, res, next) {
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

        const getUserFollowersResult = await userService.getUserFollowers(
            userId ?? req.userId,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getUserFollowersResult.success)
            throw new CustomError(getUserFollowersResult.message, getUserFollowersResult.status);

        res.status(getUserFollowersResult.followers.length ? 200 : 204).json({
            success: true,
            lastId: getUserFollowersResult.lastId,
            followers: getUserFollowersResult.followers,
        });
    } catch (error) {
        next(error);
    }
}

export async function isUserFollower(req, res, next) {
    const followeeId = Number(req.params.followeeId);

    try {
        if (!followeeId || followeeId < 1)
            throw new CustomError('No valid follewer id is provided', 400);

        if (followeeId === req.userId)
            throw new CustomError('User cannot follow himself', 400);

        const getUserFollowersResult = await userService.isUserFollower(
            followeeId,
            req.userId,
        );

        if (!getUserFollowersResult.success)
            throw new CustomError(getUserFollowersResult.message, getUserFollowersResult.status);

        res.status(200).json({
            success: true,
            isFollowing: getUserFollowersResult.isFollowing,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserFollowings(req, res, next) {
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

        const getUserFollowingsResult = await userService.getUserFollowings(
            userId ?? req.userId,
            lastId ?? 0,
            limit ?? 10
        );

        if (!getUserFollowingsResult.success)
            throw new CustomError(getUserFollowingsResult.message, getUserFollowingsResult.status);

        res.status(getUserFollowingsResult.followings.length ? 200 : 204).json({
            success: true,
            lastId: getUserFollowingsResult.lastId,
            followings: getUserFollowingsResult.followings,
        });
    } catch (error) {
        next(error);
    }
}

export async function postUserFollow(req, res, next) {
    const followeeId = Number(req.body.followeeId);

    try {
        if (!followeeId || followeeId < 1)
            throw new CustomError('No valid followee id is provided', 400);

        if (followeeId === req.userId)
            throw new CustomError('User cannot follow himself', 400);

        const postUserFollowResult = await userService.postUserFollow(
            followeeId,
            req.userId
        );

        if (!postUserFollowResult.success) {
            throw new CustomError(
                postUserFollowResult.message,
                postUserFollowResult.status
            );
        }

        res.status(201).json({
            success: true,
            message: `Successfully followed user with id '${followeeId}' `,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUserFollow(req, res, next) {
    const followeeId = Number(req.params.followeeId);

    try {
        if (!followeeId || followeeId < 1)
            throw new CustomError('No valid followee id is provided', 400);

        if (followeeId === req.userId)
            throw new CustomError('You can not unfollow yourself', 400);

        const deleteUserFollowResult = await userService.deleteUserFollow(
            followeeId,
            req.userId
        );

        if (!deleteUserFollowResult.success) {
            throw new CustomError(
                deleteUserFollowResult.message,
                deleteUserFollowResult.status
            );
        }

        res.status(200).json({
            success: true,
            message: `Successfully unfollowed user with id '${followeeId}' `,
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

        res.status(200).json({
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