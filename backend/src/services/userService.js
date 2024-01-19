import bcrypt from 'bcrypt';

import UserModel from '../models/userModel.js';
import UserFollowersModel from '../models/userFollowersModel.js';

export const getUser = async (username) => {
  const userModel = new UserModel();

  const [userRow] = await userModel.find({ username });

  if (!userRow) return { success: false, message: 'User not found' };

  return { success: true, user: userRow };
};

export const updateUser = async (userId, data) => {
  const updatedData = { ...data };

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);

    if (!updatedData.password)
      return {
        success: false,
        message: 'Failed to hash password',
        status: 500,
      };
  }

  const userModel = new UserModel();

  const updateResult = await userModel.update(updatedData, { id: userId });

  if (!updateResult.affectedRows)
    return {
      success: false,
      message: 'No user found with the provided id',
      status: 400,
    };

  return { success: true };
};

export const getUserFollowers = async (userId, lastId, limit) => {
  const userFollowersModel = new UserFollowersModel();

  const [followersRows = []] = await userFollowersModel.findFollowers(
    userId,
    lastId,
    limit
  );

  const id = followersRows[0] ? followersRows[0].id : 0;

  return {
    success: true,
    lastId: id,
    followers: followersRows,
  };
};

export const getUserFollowings = async (userId, lastId, limit) => {
  const userFollowersModel = new UserFollowersModel();

  const [followeesRows = []] = await userFollowersModel.findFollowees(
    userId,
    lastId,
    limit
  );

  const id = followeesRows[0] ? followeesRows[0].id : 0;

  return {
    success: true,
    lastId: id,
    followers: followeesRows,
  };
};

export const putUserFollow = async (followeeId, followerId) => {
  const userFollowersModel = new UserFollowersModel();

  const createResult = await userFollowersModel.create({
    userId: followeeId,
    followerId,
  });

  if (!createResult.affectedRows)
    return {
      success: false,
      message: 'No user found with the provided id',
      status: 400,
    };

  return { success: true };
};

export const deleteUserFollow = async (followeeId, followerId) => {
  const userFollowersModel = new UserFollowersModel();

  const deleteResult = await userFollowersModel.delete({
    userId: followeeId,
    followerId,
  });

  if (!deleteResult.affectedRows)
    return {
      success: false,
      message: 'No user found with the provided id',
      status: 400,
    };

  return { success: true };
};
