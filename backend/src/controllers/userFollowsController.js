import CustomError from '../utils/errorHandling.js';
import * as userFollowsService from '../services/userFollowsService.js';

export async function isUserFollowee(req, res, next) {
    const followerId = Number(req.params.followerId);

    try {
        if (!followerId || followerId < 1)
            throw new CustomError('No valid follewer id is provided', 400);

        if (followerId === req.userId)
            throw new CustomError('User cannot follow himself', 400);

        const getUserFollowersResult = await userFollowsService.isUserFollowee(
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
    const { userId, lastId, limit } = req.query;

    try {
        if (userId !== undefined && (Number.isNaN(userId) || userId === null || userId < 1))
            throw new CustomError('No valid user id is provided', 400);

        if (lastId !== undefined && (lastId === null || Number.isNaN(Number(lastId)) || Number(lastId) < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUserFollowersResult = await userFollowsService.getUserFollowers(
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

        const getUserFollowersResult = await userFollowsService.isUserFollower(
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
    const { userId, lastId, limit } = req.query;

    try {
        if (userId !== undefined && (Number.isNaN(userId) || userId === null || userId < 1))
            throw new CustomError('No valid user id is provided', 400);

        if (lastId !== undefined && (lastId === null || Number.isNaN(Number(lastId)) || Number(lastId) < 0))
            throw new CustomError('No valid last id is provided', 400);

        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUserFollowingsResult = await userFollowsService.getUserFollowings(
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

export async function getUserFollowSuggestions(req, res, next) {
    const { limit } = req.query;

    try {
        if (limit !== undefined && (limit === null || Number.isNaN(Number(limit)) || Number(limit) < 1))
            throw new CustomError('No valid limit is provided', 400);

        const getUserFollowSuggestionsResult = await userFollowsService.getUserFollowSuggestions(
            req.userId,
            limit ?? 10
        );

        if (!getUserFollowSuggestionsResult.success)
            throw new CustomError(getUserFollowSuggestionsResult.message, getUserFollowSuggestionsResult.status);

        res.status(getUserFollowSuggestionsResult.users.length ? 200 : 204).json({
            success: true,
            users: getUserFollowSuggestionsResult.users,
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

        const postUserFollowResult = await userFollowsService.postUserFollow(
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

        const deleteUserFollowResult = await userFollowsService.deleteUserFollow(
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
