import { body } from 'express-validator';

import UserModel from '../models/userModel.js';

export const loginValidation = [
  body('email', 'Please enter a valid email address').isEmail(),
  body(
    'password',
    'Password must be at least 5 characters long and contain only letters and numbers.'
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
];

export const signupValidation = [
  body('firstname')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter your firstname'),
  body('lastname')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter your lastname'),
  body('username')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter a username')
    .isAlphanumeric()
    .withMessage('Username must only contain letters and numbers')
    .custom(async (signingUsername) => {
      const userModel = new UserModel();
      const [rows] = await userModel.find({ username: signingUsername });
      if (rows.length)
        throw Error(
          'This username is already in use, please try another username'
        );
    }),
  body('email')
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (signingEmail) => {
      const userModel = new UserModel();
      const [rows] = await userModel.find({ email: signingEmail });
      if (rows.length)
        throw Error('This Email is already in use, please try another email');
    }),
  body(
    'password',
    'Password must be at least 5 characters and contains only numbers and letters without spaces'
  )
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('You must type a password')
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body('confirmPassword', 'Passwords do not match').custom(
    (signingConfirmPassword, { req }) =>
      signingConfirmPassword === req.body.password
  ),
];

export const forgotPasswordValidation = [
  body('email', 'Please enter a valid email address').isEmail(),
];

export const resetPasswordValidation = [
  body(
    'password',
    'Password must be at least 5 characters and contains only numbers and letters without spaces'
  )
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('You must type a password')
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body('confirmPassword', 'Passwords do not match').custom(
    (signingConfirmPassword, { req }) =>
      signingConfirmPassword === req.body.password
  ),
];
