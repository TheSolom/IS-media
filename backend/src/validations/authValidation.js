import { body, oneOf } from 'express-validator';

import UserModel from '../models/userModel.js';

export const loginValidation = [
  oneOf([
    body('emailOrUsername')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Please enter an email or username')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('emailOrUsername')
      .trim()
      .exists({ values: 'falsy' })
      .withMessage('Please enter an email or username')
      .isLength({ min: 5, max: 20 })
      .withMessage(
        'Username must only contain letters and numbers between 5-20 characters long'
      )
      .isAlphanumeric()
      .withMessage(
        'Username must only contain letters and numbers between 5-20 characters long'
      ),
  ]),
  body('password')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('You must type a password')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be 8 to 64 characters long')
    .isAlphanumeric()
    .withMessage(
      'Password must contains only numbers and letters without spaces'
    ),
];

export const signupValidation = [
  body('firstname')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter your firstname')
    .isString()
    .withMessage('Firstname must be a string'),
  body('lastname')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter your lastname')
    .isString()
    .withMessage('Lastname must be a string'),
  body('username')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Please enter a username')
    .isLength({ min: 5, max: 20 })
    .withMessage('Username must be between 5-20 characters long')
    .isAlphanumeric()
    .withMessage('Username must only contain letters and numbers')
    .custom(async (signingUsername) => {
      const userModel = new UserModel();
      const [userRow] = await userModel.find({ username: signingUsername });

      if (userRow)
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
      const [userRow] = await userModel.find({ email: signingEmail });

      if (userRow)
        throw Error('This Email is already in use, please try another email');
    }),
  body('password')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('You must type a password')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be 8 to 64 characters long')
    .isAlphanumeric()
    .withMessage(
      'Password must contains only numbers and letters without spaces'
    ),
  body(
    'confirmPassword',
    'Password does not match with the confirm password'
  ).custom(
    (signingConfirmPassword, { req }) =>
      signingConfirmPassword === req.body.password
  ),
  body('birthDate')
    .notEmpty()
    .withMessage('Birth date is required')
    .isISO8601()
    .withMessage('Birth date must be a valid date')
    .custom((signingBirthDate) => {
      const age = Math.floor(
        (new Date() - new Date(signingBirthDate)) / (1000 * 60 * 60 * 24 * 365) // convert ms to years
      );
      return age >= 13;
    }),
  body('gender')
    .trim()
    .isIn(['male', 'female', 'not specified'])
    .withMessage('Gender must be male, female or not specified'),
];

export const forgotPasswordValidation = [
  oneOf([
    body('emailOrUsername')
      .trim()
      .exists({ checkFalsy: true })
      .withMessage('Please enter an email or username')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('emailOrUsername')
      .trim()
      .exists({ values: 'falsy' })
      .withMessage('Please enter an email or username')
      .isLength({ min: 5, max: 20 })
      .withMessage(
        'Username must only contain letters and numbers between 5-20 characters long'
      )
      .isAlphanumeric()
      .withMessage(
        'Username must only contain letters and numbers between 5-20 characters long'
      ),
  ]),
];

export const resetPasswordValidation = [
  body('password')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('You must type a password')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be 8 to 64 characters long')
    .isAlphanumeric()
    .withMessage(
      'Password must contains only numbers and letters without spaces'
    ),
  body(
    'confirmPassword',
    'Password does not match with the confirm password'
  ).custom(
    (signingConfirmPassword, { req }) =>
      signingConfirmPassword === req.body.password
  ),
];
