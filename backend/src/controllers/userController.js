import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userService.js';

export async function getUser(req, res, next) {
  const { username } = req.params;

  try {
    if (!username) throw new CustomError('No valid username is provided', 400);

    const getUserResult = await userService.getUser(username);

    if (!getUserResult.success)
      throw new CustomError(getUserResult.message, 404);

    const { user } = getUserResult;
    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const { body } = req;

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(
        'Validation failed, updating data is incorrect',
        422,
        errors.array()[0].msg
      );
    }

    const getupdateUserResult = await userService.updateUser(req.userId, body);

    if (!getupdateUserResult.success)
      throw new CustomError(
        getupdateUserResult.message,
        getupdateUserResult.status
      );

    res.status(201).json({
      success: true,
      message: 'Successfully updated user',
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserFollowers(req, res, next) {
  const lastId = Number(req.query.lastId) || 0;
  const limit = Number(req.query.limit) || 10;

  try {
    const getUserFollowersResult = await userService.getUserFollowers(
      req.userId,
      lastId,
      limit
    );

    if (!getUserFollowersResult.success)
      throw new CustomError(
        getUserFollowersResult.message,
        getUserFollowersResult.status
      );

    res.status(200).json({
      success: true,
      lastId: getUserFollowersResult.lastId,
      followers: getUserFollowersResult.followers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserFollowings(req, res, next) {
  const lastId = Number(req.query.lastId) || 0;
  const limit = Number(req.query.limit) || 10;

  try {
    const getUserFollowingsResult = await userService.getUserFollowings(
      req.userId,
      lastId,
      limit
    );

    if (!getUserFollowingsResult.success)
      throw new CustomError(
        getUserFollowingsResult.message,
        getUserFollowingsResult.status
      );

    res.status(200).json({
      success: true,
      lastId: getUserFollowingsResult.lastId,
      followers: getUserFollowingsResult.followers,
    });
  } catch (error) {
    next(error);
  }
}

export async function putUserFollow(req, res, next) {
  const followeeId = Number(req.params.followeeId);

  try {
    if (!followeeId || followeeId < 0)
      throw new CustomError('No valid followee id is provided', 400);

    if (req.userId === followeeId)
      throw new CustomError('You can not follow yourself', 400);

    const putUserFollowResult = await userService.putUserFollow(
      followeeId,
      req.userId
    );

    if (!putUserFollowResult.success) {
      throw new CustomError(
        putUserFollowResult.message,
        putUserFollowResult.status
      );
    }

    res.status(201).json({
      success: true,
      message: 'Successfully followed user',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserFollow(req, res, next) {
  const followeeId = Number(req.params.followeeId);

  try {
    if (!followeeId || followeeId < 0)
      throw new CustomError('No valid followee id is provided', 400);

    if (req.userId === followeeId)
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

    res.status(201).json({
      success: true,
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    next(error);
  }
}
