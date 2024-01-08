import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as authService from '../services/authService.js';

export async function postLogin(req, res, next) {
  const MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds
  const { email, password } = req.body;

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(
        'Validation failed, Signingup data is incorrect',
        422,
        errors.array()[0].msg
      );
    }

    const loginResult = await authService.loginUser(email, password, MAX_AGE);

    if (!loginResult.success)
      throw new CustomError(loginResult.message, loginResult.status);

    res.setHeader(
      'Set-Cookie',
      `jwt=${loginResult.token}; Max-Age= ${MAX_AGE}; HttpOnly; SameSite=Strict; Path=/`
    );

    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      userId: loginResult.userId,
    });
  } catch (error) {
    error.error = errors.array()[0]?.msg;
    next(error);
  }
}

export async function postSignup(req, res, next) {
  const { firstname, lastname, username, email, password } = req.body;

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(
        'Validation failed, Signingup data is incorrect',
        422,
        errors.array()[0].msg
      );
    }

    const signupResult = await authService.signupUser(
      firstname,
      lastname,
      username,
      email,
      password
    );

    if (!signupResult.success)
      throw new CustomError(signupResult.error, signupResult.status);

    res.status(201).json({
      success: true,
      message: 'Successfully signed up',
      userId: signupResult.createResult.insertId,
    });
  } catch (error) {
    error.error = errors.array()[0]?.msg;
    next(error);
  }
}

export async function postLogout(req, res, next) {
  try {
    if (!req.headers.cookie)
      throw new CustomError('You must be logged in', 401);

    const logoutResult = await authService.logoutUser(req.headers.cookie);

    if (!logoutResult.success)
      throw new CustomError(logoutResult.message, logoutResult.status);

    res
      .clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
      })
      .status(200)
      .json({ success: true, message: 'Successfully logged out' });
  } catch (error) {
    next(error);
  }
}
