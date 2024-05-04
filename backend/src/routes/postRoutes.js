import express from 'express';

import {
    getUserPosts,
    getFeedPosts,
    getSuggestedPosts,
    getPost,
    postPost,
    updatePost,
    deletePost,
} from '../controllers/postController.js';
import {
    createPostValidation,
    updatePostValidation
} from '../validations/postValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/user', getUserPosts);

router.get('/feed', getFeedPosts);

router.get('/suggestions', getSuggestedPosts);

router.get('/:postId', getPost);

router.post('/', createPostValidation, postPost);

router.put('/:postId', updatePostValidation, updatePost);

router.delete('/:postId', deletePost);

export default router;