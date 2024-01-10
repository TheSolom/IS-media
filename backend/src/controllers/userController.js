import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userService.js';

export async function getUser(req, res, next) {
  const userId = Number(req.params.userId);

  try {
    if (!userId) throw new CustomError('No valid user id is provided', 400);

    const getUserResult = await userService.getUser(userId);

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
  const userId = Number(req.params.userId);

  try {
    if (!userId) throw new CustomError('No valid user id is provided', 400);

    if (userId !== Number(req.userId))
      throw new CustomError(
        'Unauthorized, you can only edit your profile',
        401
      );

    if (Object.keys(body).length === 0)
      throw new CustomError('No data provided', 400);

    const allowedProperties = [
      'firstname',
      'lastname',
      'username',
      'email',
      'password',
      'about',
      'profilePicture',
      'coverPicture',
      'country',
      'livesIn',
      'relationship',
    ];

    Object.keys(body).forEach((key) => {
      if (!allowedProperties.includes(key))
        throw new CustomError('Wrong data provided', 400);
    });

    const info = await userService.updateUser(userId, body);

    res.status(201).json({
      success: true,
      message: 'Successfully updated user',
      info,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserFollowers(req, res, next) {
  const userId = Number(req.params.userId);
  const lastId = Number(req.query.lastId) || 0;
  const limit = Number(req.query.limit) || 10;

  try {
    if (!userId) throw new CustomError('No valid user id is provided', 400);

    const getUserFollowersResult = await userService.getUserFollowers(
      userId,
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
