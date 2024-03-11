import { body } from 'express-validator';

import UserModel from '../models/userModel.js';

const updateUserValidation = [
  body('firstname')
    .optional()
    .trim()
    .isString()
    .withMessage('Firstname must be a string'),
  body('lastname')
    .optional()
    .trim()
    .isString()
    .withMessage('Lastname must be a string'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Username must be between 5-20 characters long')
    .isAlphanumeric()
    .withMessage('Username must only contain letters and numbers')
    .custom(async (signingUsername, { req }) => {
      const userModel = new UserModel();
      const [userRow] = await userModel.find({ username: signingUsername });

      if (userRow.length && userRow[0].id !== req.userId)
        throw Error(
          'This username is already in use, please try another username'
        );
    }),
  body('email')
    .optional()
    .normalizeEmail({ gmail_remove_dots: false })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .custom(async (signingEmail, { req }) => {
      const userModel = new UserModel();
      const [userRow] = await userModel.find({ email: signingEmail });

      if (userRow.length && userRow[0].id !== req.userId)
        throw Error('This Email is already in use, please try another email');
    }),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be 8 to 64 characters long')
    .isAlphanumeric()
    .withMessage(
      'Password must contains only numbers and letters without spaces'
    ),
  body('birthDate')
    .optional()
    .notEmpty()
    .withMessage('Birth date is required')
    .isISO8601()
    .withMessage('Birth date must be a valid yyyy-mm-dd date'),
  body('gender')
    .optional()
    .trim()
    .isIn(['male', 'female', 'Male', 'Female'])
    .withMessage('Gender must be male or female'),
  body('about')
    .optional()
    .trim()
    .isString()
    .withMessage('About must be a string'),
  body('profilePicture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Profile picture must be a URL'),
  body('coverPicture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Cover picture must be a URL'),
  body('livesIn')
    .optional()
    .trim()
    .isString()
    .withMessage('LivesIn must be a string'),
  body('worksAt')
    .optional()
    .trim()
    .isString()
    .withMessage('WorksAt must be a string'),
  body('relationship')
    .optional()
    .trim()
    .isString()
    .withMessage('Relationship must be a string'),
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) throw new Error('No data provided');

    const allowedFields = [
      'firstname',
      'lastname',
      'username',
      'email',
      'password',
      'birthDate',
      'gender',
      'about',
      'profilePicture',
      'coverPicture',
      'livesIn',
      'worksAt',
      'relationship',
    ];

    Object.keys(req.body).forEach((key) => {
      if (!allowedFields.includes(key))
        throw new Error(`Field ${key} is not allowed`);
    });

    return true;
  }),
];

export default updateUserValidation;
