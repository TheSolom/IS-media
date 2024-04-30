import express from 'express';

import {
    getMostUsedTags,
} from '../controllers/userTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/most-used-tags', getMostUsedTags);

export default router;
