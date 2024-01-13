import CustomError from '../utils/errorHandling.js';
import UserModel from '../models/userModel.js';
import UserFollowersModel from '../models/userFollowersModel.js';

export const getUser = async (userId) => {
  const userModel = new UserModel();

  const [rows] = await userModel.find({ id: userId });

  if (!rows) return { success: false, message: 'User not found' };

  return { success: true, user: rows };
};

export const updateUser = async (userId, data) => {
  const userModel = new UserModel();

  const updateResult = await userModel.update(data, { id: userId });

  if (!updateResult.affectedRows)
    throw new CustomError('No user found with the provided id', 400);

  return { success: true };
};

export const getUserFollowers = async (userId, lastId, limit) => {
  const userFollowersModel = new UserFollowersModel();

  const [rows = []] = await userFollowersModel.findFollowers(
    userId,
    lastId,
    limit
  );

  const id = rows[0] ? rows[0].id : 0;

  return {
    success: true,
    lastId: id,
    followers: rows,
  };
};

export const getUserFollowings = async (userId, lastId, limit) => {
  const userFollowersModel = new UserFollowersModel();

  const [rows = []] = await userFollowersModel.findFollowees(
    userId,
    lastId,
    limit
  );

  const id = rows[0] ? rows[0].id : 0;

  return {
    success: true,
    lastId: id,
    followers: rows,
  };
};

export const putUserFollow = async (followeeId, followerId) => {
  const userFollowersModel = new UserFollowersModel();

  const createResult = await userFollowersModel.create({
    userId: followeeId,
    followerId,
  });

  if (!createResult.affectedRows)
    throw new CustomError('No user found with the provided id', 400);

  return { success: true };
};

export const deleteUserFollow = async (followeeId, followerId) => {
  const userFollowersModel = new UserFollowersModel();

  const deleteResult = await userFollowersModel.delete({
    userId: followeeId,
    followerId,
  });

  if (!deleteResult.affectedRows)
    throw new CustomError('No user found with the provided id', 400);

  return { success: true };
};
