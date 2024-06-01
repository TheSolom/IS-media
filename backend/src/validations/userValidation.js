import { body, param } from 'express-validator';

import UserModel from '../models/userModel.js';
import checkImageUrl from '../utils/isValidImageUrl.js';

export const searchUserValidation = [
    param('username')
        .trim()
        .notEmpty()
        .withMessage('No valid username is provided')
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers'),
];

export const updateUserValidation = [
    body('firstname')
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('Firstname must be between 1-45 characters long')
        .isAlpha()
        .withMessage('Firstname must only contain letters'),
    body('lastname')
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('Lastname must be between 1-45 characters long')
        .isAlpha()
        .withMessage('Lastname must only contain letters'),
    body('username')
        .trim()
        .isLength({ min: 5, max: 20 })
        .withMessage('Username must be between 5-20 characters long')
        .isAlphanumeric()
        .withMessage('Username must only contain letters and numbers')
        .custom(async (signingUsername, { req }) => {
            const userModel = new UserModel();
            const [userRow] = await userModel.find({ username: signingUsername });

            if (userRow.length && userRow[0].id !== req.userId)
                throw Error('This username is already in use, please try another username');
        }),
    body('email')
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
        .trim()
        .isLength({ min: 8, max: 64 })
        .withMessage('Password must be between 8-64 characters long')
        .isAlphanumeric()
        .withMessage('Password must contains only numbers and letters without spaces'),
    body('birthDate')
        .isISO8601()
        .withMessage('Birth date must be a valid yyyy-mm-dd date')
        .custom((signingBirthDate) => {
            const age = Math.floor(
                (new Date() - new Date(signingBirthDate)) / (1000 * 60 * 60 * 24 * 365) // convert ms to years
            );
            return age >= 13;
        })
        .withMessage('You must be at least 13 years old'),
    body('gender')
        .trim()
        .isIn(['male', 'female', 'Male', 'Female'])
        .withMessage('Gender must be male or female'),
    body('about')
        .optional()
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('about must be between 1-45 characters long'),
    body('profilePicture')
        .optional()
        .custom(async (value) => !value ? true : checkImageUrl(value))
        .withMessage('Profile picture must be a URL'),
    body('coverPicture')
        .optional()
        .custom(async (value) => !value ? true : checkImageUrl(value))
        .withMessage('Cover picture must be a URL'),
    body('livesIn')
        .optional()
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('LivesIn must be between 1-45 characters long'),
    body('worksAt')
        .optional()
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('WorksAt must be between 1-45 characters long'),
    body('relationship')
        .optional()
        .trim()
        .isLength({ min: 1, max: 45 })
        .withMessage('Relationship must be between 1-45 characters long'),
    body().custom((value, { req }) => {
        if (Object.keys(req.body).length === 0)
            throw new Error('No data provided');

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
