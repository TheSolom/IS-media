import express from 'express';

import {
    getPost,
    postPost,
    updatePost,
    deletePost,
    getUserPosts,
    getFeedPosts,
    getPostLikes,
    postPostLike,
    deletePostLike,
    getPostComments,
    postPostComment,
    updatePostComment,
    deletePostComment,
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

router.get('/likes/:postId', getPostLikes);

router.post('/like', postPostLike);

router.delete('/like/:postId', deletePostLike);

router.get('/comments/:postId', getPostComments);

router.post('/comment', postPostComment);

router.patch('/comment/:commentId', updatePostComment);

router.delete('/comment/:commentId', deletePostComment);

export default router;