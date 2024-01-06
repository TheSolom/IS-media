import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as authService from '../services/authService.js';

export async function postLogin(req, res, next) {
  const { email, password } = req.body;
  const MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(
        'Validation failed, Signingup data is incorrect',
        422,
        errors.array()[0].msg
      );
    }

    const result = await authService.loginUser(email, password, MAX_AGE);

    res.cookie('jwt', result.token, { httpOnly: true, maxAge: MAX_AGE * 1000 }); // in milliseconds so * 1000

    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      userId: result.userId,
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

    const result = await authService.signupUser(
      firstname,
      lastname,
      username,
      email,
      password
    );

    res.status(201).json({
      success: true,
      message: 'Successfully signed up',
      userId: result.insertId,
    });
  } catch (error) {
    error.errors = errors.array()[0]?.msg;
    next(error);
  }
}
