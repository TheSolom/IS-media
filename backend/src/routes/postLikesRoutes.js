import express from 'express';

import {
    getPostLikes,
    postPostLike,
    deletePostLike,
} from '../controllers/postLikesController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/likes/:postId', getPostLikes);

router.post('/like', postPostLike);

router.delete('/like/:postId', deletePostLike);

export default router;