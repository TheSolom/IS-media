import CustomError from '../utils/errorHandling.js';
import UserModel from '../models/userModel.js';
import UserFollowersModel from '../models/userFollowersModel.js';

export const getUser = async (userId) => {
  const userModel = new UserModel();

  const [rows] = await userModel.findById(userId);

  if (!rows) return { success: false, message: 'User not found' };

  return { success: true, user: rows };
};

export const updateUser = async (userId, data) => {
  const userModel = new UserModel();

  const updateResult = await userModel.updateById(userId, data);

  if (!updateResult.affectedRows)
    throw new CustomError('No user found with the provided id', 400);

  return updateResult.info;
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
