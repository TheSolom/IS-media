import express from 'express';

import {
    getPostLikes,
    postPostLike,
    deletePostLike,
} from '../controllers/postLikesController.js';
import cursorPaginationValidation from '../validations/cursorPaginationValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId/likes', cursorPaginationValidation, getPostLikes);

router.post('/likes', postPostLike);

router.delete('/:postId/likes', deletePostLike);

export default router;