import { body, query } from 'express-validator';

export const getUserStoriesValidation = [
    query('active', 'active must be a boolean value true/false')
        .if(query('active').exists())
        .isBoolean()
        .isIn([true, false])
];

export const createStoryValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 100 })
        .withMessage('Content must be at most 100 characters'),
];
