import express from 'express';

import {
    getCommentTags,
    getTagComments,
} from '../controllers/commentTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:commentId/tags', getCommentTags);

router.get('/tags/:tag', getTagComments);

export default router;