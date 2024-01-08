import CustomError from '../utils/errorHandling.js';
import UserModel from '../models/userModel.js';

export const getUser = async (userId) => {
  const userModel = new UserModel();

  const [rows] = await userModel.findById(userId);

  if (!rows) throw new CustomError('User not found', 400);

  return rows;
};

export const updateUser = async (userId, data) => {
  const userModel = new UserModel();

  const result = await userModel.updateById(userId, data);

  if (!result.affectedRows)
    throw new CustomError('No user found with the provided id', 400);

  return result.info;
};
