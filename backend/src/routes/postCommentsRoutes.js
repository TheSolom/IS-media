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

router.get('/:postId/comments', getPostComments);

router.post('/comments', postPostComment);

router.put('/comments/:commentId', updatePostComment);

router.delete('/comments/:commentId', deletePostComment);

export default router;