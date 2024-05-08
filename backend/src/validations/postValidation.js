import { body, param } from 'express-validator';

import PostModel from '../models/postModel.js';

export const createPostValidation = [
    body('title')
        .trim()
        .default('')
        .if(body('title').exists())
        .isLength({ max: 255 })
        .withMessage('Title must be at most 255 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 500 })
        .withMessage('Content must be at most 500 characters'),
    body('parentId', 'No valid parent post id is provided')
        .default(null)
        .if(body('parentId').exists())
        .custom(async (value) => {
            if (value === null)
                return true;

            const parentId = Number(value);

            if (!Number.isNaN(parentId) && parentId > 0) {
                const postModel = new PostModel();
                const [postRow] = await postModel.find({ id: parentId });

                if (!postRow.length)
                    throw new Error('parent post is not found');

                return true;
            }

            throw new Error();
        }),
];

export const updatePostValidation = [
    body('title')
        .trim()
        .default('')
        .if(body('title').exists())
        .isLength({ max: 255 })
        .withMessage('Title must be at most 255 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 500 })
        .withMessage('Content must be at most 500 characters'),
    param('postId', 'No valid post id is provided')
        .isNumeric()
        .custom((value) => {
            if (Number(value) < 1)
                throw new Error();
            return true;
        }),
];
