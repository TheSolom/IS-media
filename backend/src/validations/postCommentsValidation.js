import { body, param } from 'express-validator';

import PostModel from '../models/postModel.js';

export const getPostCommentsValidation = [
    param('postId', 'No valid post id is provided')
        .isInt({ min: 1 })
        .custom(async (value) => {
            if (Number.isInteger(value) && value > 0) {
                const postModel = new PostModel();
                const [postRow] = await postModel.find({ id: value });

                if (!postRow.length)
                    throw new Error('post is not found');
            }

            return true;
        }),
];

export const createPostCommentValidation = [
    body('title')
        .trim()
        .default('')
        .if(body('title').exists())
        .isLength({ max: 100 })
        .withMessage('Title must be at most 100 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 100 })
        .withMessage('Content must be at most 100 characters'),
    body('postId', 'No valid post id is provided')
        .isNumeric()
        .custom(async (value) => {
            const postId = Number(value);

            if (postId < 1)
                throw new Error();

            const postModel = new PostModel();
            const [postRow] = await postModel.find({ id: postId });

            if (!postRow.length)
                throw new Error('post is not found');

            return true;
        }),
];

export const updatePostCommentValidation = [
    body('title')
        .trim()
        .default('')
        .if(body('title').exists())
        .isLength({ max: 100 })
        .withMessage('Title must be at most 100 characters'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('No valid content is provided')
        .isLength({ max: 100 })
        .withMessage('Content must be at most 100 characters'),
    param('commentId', 'No valid comment id is provided')
        .isNumeric()
        .custom((value) => {
            if (Number(value) < 1)
                throw new Error();
            return true;
        }),
];
