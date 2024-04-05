import express from 'express';

import {
    getPost,
    postPost,
    updatePost,
    deletePost,
    getFeedPosts,
    getUserPosts,
} from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId', getPost);

router.post('/', postPost);

router.patch('/:postId', updatePost);

router.delete('/:postId', deletePost);

router.get('/feed', getFeedPosts);

router.get('/user', getUserPosts);

export default router;