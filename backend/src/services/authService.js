import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import CustomError from '../utils/errorHandling.js';
import UserModel from '../models/userModel.js';

export const createToken = (id, username, isAdmin, MAX_AGE) => {
  const token = jwt.sign({ id, username, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });

  if (!token) throw new CustomError('Failed to create token', 500);

  return token;
};

export const loginUser = async (email, password, MAX_AGE) => {
  const userModel = new UserModel();
  try {
    const [rows] = await userModel.findByEmail(email);

    if (rows.length === 0) {
      throw new CustomError(
        'Incorrect email or password. Please try again',
        401
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, rows[0].password);

    if (!isPasswordMatch) {
      throw new CustomError(
        'Incorrect email or password. Please try again',
        401
      );
    }

    const token = createToken(rows[0].id, rows[0].username, MAX_AGE);

    return { token, userId: rows[0].id };
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};

export const signupUser = async (
  firstname,
  lastname,
  username,
  email,
  password
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!hashedPassword) throw new CustomError('Failed to hash password', 500);

  const userModel = new UserModel();

  const newUser = {
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
  };

  try {
    const result = await userModel.create(newUser);

    return result;
  } catch (error) {
    throw new CustomError(error.message, error.status);
  }
};
