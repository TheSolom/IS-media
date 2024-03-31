import express from 'express';

import {
    getPostTags,
} from '../controllers/postTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId', getPostTags);

export default router;