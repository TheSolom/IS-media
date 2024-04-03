import express from 'express';

import {
    getPost,
    postPost,
    updatePost,
    deletePost,
    getUserPosts,
    getFeedPosts,
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/post/:postId', getPost);

router.post('/post', postPost);

router.patch('/post/:postId', updatePost);

router.delete('/post/:postId', deletePost);

router.get('/user/feed', getFeedPosts);

router.get('/user', getUserPosts);

export default router;