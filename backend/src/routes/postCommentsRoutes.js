import express from 'express';

import {
    getPostComments,
    postPostComment,
    updatePostComment,
    deletePostComment,
} from '../controllers/postCommentsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/comments/:postId', getPostComments);

router.post('/comment', postPostComment);

router.patch('/comment/:commentId', updatePostComment);

router.delete('/comment/:commentId', deletePostComment);

export default router;