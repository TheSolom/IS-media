import { body, param, query } from 'express-validator';

import UserModel from '../models/userModel.js';
import PostModel from '../models/postModel.js';

export const getUserPostsValidation = [
    query('userId', 'No valid user id is provided')
        .if(query('userId').exists())
        .custom(async (value) => {
            const userId = Number(value);

            if (Number.isInteger(userId) && userId > 0) {
                const userModel = new UserModel();
                const [userRow] = await userModel.find({ id: userId });

                if (!userRow.length)
                    throw new Error('user is not found');

                return true;
            }

            throw new Error();
        }),
];

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

            if (Number.isInteger(parentId) && parentId > 0) {
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
