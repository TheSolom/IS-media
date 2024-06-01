import { body, query } from 'express-validator';

export const getUserStoriesValidation = [
    query('activeOnly', 'activeOnly must be a boolean value true/false')
        .if(query('activeOnly').exists())
        .isBoolean()
        .isIn([true, false]),
    query('pastOnly', 'pastOnly must be a boolean value true/false')
        .if(query('pastOnly').exists())
        .isBoolean()
        .isIn([true, false]),
];

export const createStoryValidation = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 100 })
        .withMessage('Content must be at most 100 characters'),
];
