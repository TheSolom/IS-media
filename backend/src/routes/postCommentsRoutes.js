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

router.get('/:postId', getPostComments);

router.post('/', postPostComment);

router.put('/:commentId', updatePostComment);

router.delete('/:commentId', deletePostComment);

export default router;