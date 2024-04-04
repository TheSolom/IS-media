import express from 'express';

import {
    getPostLikes,
    postPostLike,
    deletePostLike,
} from '../controllers/postLikesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId', getPostLikes);

router.post('/', postPostLike);

router.delete('/:postId', deletePostLike);

export default router;