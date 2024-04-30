import express from 'express';

import {
    getPostTags,
    getTagPosts,
} from '../controllers/postTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:postId/tags', getPostTags);

router.get('/tags/:tag', getTagPosts);

export default router;