import { body, query } from 'express-validator';

export const getUserStoriesValidation = [
    query('active')
        .if(query('active').exists())
        .isBoolean()
        .withMessage('active must be a boolean value'),
];

export const createStoryValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 100 })
        .withMessage('Content must be at most 100 characters'),
];
