import express from 'express';

import {
    getPostTags,
    getTagPosts,
} from '../controllers/postTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/post/:postId', getPostTags);

router.get('/tag/:tag', getTagPosts);

export default router;