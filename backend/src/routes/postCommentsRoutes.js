import express from 'express';

import {
    getPostComment,
    getPostComments,
    postPostComment,
    updatePostComment,
    deletePostComment,
} from '../controllers/postCommentsController.js';
import {
    createPostCommentValidation,
    updatePostCommentValidation
} from '../validations/postCommentsValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/comments/:commentId', getPostComment);

router.get('/:postId/comments', getPostComments);

router.post('/comments', createPostCommentValidation, postPostComment);

router.put('/comments/:commentId', updatePostCommentValidation, updatePostComment);

router.delete('/comments/:commentId', deletePostComment);

export default router;