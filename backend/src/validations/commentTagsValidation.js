import { param } from 'express-validator';

const getTagCommentsValidation = [
    param('tag')
        .trim()
        .exists({ values: 'falsy' })
        .withMessage('No valid tag is provided')
        .length({ max: 499 })
        .withMessage('Tag must be between 1 - 499 characters long')
        .isAlphanumeric()
        .withMessage('Tag must only contain letters and numbers'),
];

export default getTagCommentsValidation;