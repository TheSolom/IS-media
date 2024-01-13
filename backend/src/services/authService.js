import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import parseCookies from '../utils/parseCookies.js';
import UserModel from '../models/userModel.js';
import TokenBlacklistModel from '../models/tokenBlacklistModel.js';

const parseJwt = (token) =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

export const createToken = async (id, username, MAX_AGE) => {
  try {
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: MAX_AGE,
    });

    return { success: true, token };
  } catch (error) {
    return { success: false, message: error.message, status: error.status };
  }
};

export const loginUser = async (email, password, MAX_AGE) => {
  const userModel = new UserModel();
  try {
    const [rows] = await userModel.find({email});

    if (!rows)
      return {
        success: false,
        message: 'Incorrect email or password. Please try again',
        status: 401,
      };

    const isPasswordMatch = await bcrypt.compare(password, rows.password);

    if (!isPasswordMatch)
      return {
        success: false,
        message: 'Incorrect email or password. Please try again',
        status: 401,
      };

    const createTokenResult = await createToken(
      rows.id,
      rows.username,
      MAX_AGE
    );

    if (!createTokenResult.success)
      return {
        success: false,
        error: createTokenResult.error,
        status: createTokenResult.status,
      };

    return { success: true, token: createTokenResult.token, userId: rows.id };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
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

  if (!hashedPassword)
    return { success: false, message: 'Failed to hash password', status: 401 };

  const newUser = {
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
  };

  try {
    const userModel = new UserModel();
    const createResult = await userModel.create(newUser);

    return { success: true, createResult };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

export const logoutUser = async (cookies) => {
  try {
    const parsedCookies = parseCookies(cookies);

    const { exp } = parseJwt(parsedCookies.jwt);

    const tokenBlacklist = new TokenBlacklistModel();
    await tokenBlacklist.create({
      token: parsedCookies.jwt,
      expiration_timestamp: exp,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};
