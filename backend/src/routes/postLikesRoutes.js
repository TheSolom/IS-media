import express from 'express';

import {
    getPostLikes,
    postPostLike,
    deletePostLike,
} from '../controllers/postLikesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId/likes', getPostLikes);

router.post('/likes', postPostLike);

router.delete('/:postId/likes', deletePostLike);

export default router;