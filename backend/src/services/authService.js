import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import isEmail from 'validator/lib/isEmail.js';

import * as parseUtil from '../utils/parseUtil.js';
import UserModel from '../models/userModel.js';
import TokenBlacklistModel from '../models/tokenBlacklistModel.js';
import TokenModel from '../models/tokenModel.js';
import transporter from '../configs/transporter.js';

const createToken = async (id, username, MAX_AGE) => {
  try {
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
      expiresIn: MAX_AGE,
    });

    return { success: true, token };
  } catch (error) {
    return { success: false, message: error.message, status: error.status };
  }
};

export const loginUser = async (emailOrUsername, password, MAX_AGE) => {
  const userModel = new UserModel();

  let userRow;
  try {
    if (isEmail(emailOrUsername)) {
      const email = emailOrUsername;
      [userRow] = await userModel.find({ email });
    } else {
      const username = emailOrUsername;
      [userRow] = await userModel.find({ username });
    }

    if (!userRow)
      return {
        success: false,
        message: 'Incorrect email or password. Please try again',
        status: 401,
      };

    const isPasswordMatch = await bcrypt.compare(password, userRow.password);

    if (!isPasswordMatch)
      return {
        success: false,
        message: 'Incorrect email or password. Please try again',
        status: 401,
      };

    const createTokenResult = await createToken(
      userRow.id,
      userRow.username,
      MAX_AGE
    );

    if (!createTokenResult.success)
      return {
        success: false,
        error: createTokenResult.error,
        status: createTokenResult.status,
      };

    await userModel.update({ is_active: 1 }, { id: userRow.id });

    return {
      success: true,
      token: createTokenResult.token,
      userId: userRow.id,
    };
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
  password,
  birthDate,
  gender
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!hashedPassword)
    return { success: false, message: 'Failed to hash password', status: 500 };

  const newUser = {
    firstname,
    lastname,
    username,
    email,
    password: hashedPassword,
    birth_date: birthDate,
    gender,
  };

  const userModel = new UserModel();

  try {
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
  const tokenBlacklist = new TokenBlacklistModel();
  const userModel = new UserModel();

  try {
    const parsedCookies = parseUtil.parseCookies(cookies);

    const { id, exp } = parseUtil.parseJwt(parsedCookies.jwt);

    await tokenBlacklist.create({
      token: parsedCookies.jwt,
      expiration_date: new Date(exp),
    });

    await userModel.update({ is_active: 0 }, { id });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

export const forgotPassword = async (emailOrUsername, MAX_AGE) => {
  const userModel = new UserModel();
  const tokenModel = new TokenModel();

  let userRow;
  try {
    if (isEmail(emailOrUsername)) {
      const email = emailOrUsername;
      [userRow] = await userModel.find({ email });
    } else {
      const username = emailOrUsername;
      [userRow] = await userModel.find({ username });
    }

    if (!userRow)
      return {
        success: false,
        message: 'Incorrect email. Please try again',
        status: 422,
      };

    const token = crypto.randomBytes(32).toString('hex');

    await tokenModel.create({
      user_id: userRow.id,
      token,
      expiration_date: new Date(Date.now() + MAX_AGE),
    });

    const resetUrl = `http://localhost:5000/reset-password/${token}`;

    const mailOptions = {
      from: 'onboarding@resend.dev',
      to: 'eslam.01212@gmail.com',
      subject: 'ES Media Password reset',
      text: `You requested a password reset.

      For reseting your password please click on the link below: 
      ${resetUrl} 
      If you did not request a password reset, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, info };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};

export const resetPassword = async (token, password) => {
  const tokenModel = new TokenModel();
  const userModel = new UserModel();

  try {
    const [tokenRow] = await tokenModel.find({ token });

    if (!tokenRow)
      return {
        success: false,
        message: 'Invalid or expired token. Please try again',
        status: 401,
      };

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      return {
        success: false,
        message: 'Failed to hash password',
        status: 401,
      };

    const updateResult = await userModel.update(
      { password: hashedPassword },
      { id: tokenRow.user_id }
    );

    if (!updateResult.affectedRows)
      return {
        success: false,
        message: 'Failed to update password',
        status: 401,
      };

    await tokenModel.delete({ token });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      status: error.status,
    };
  }
};
