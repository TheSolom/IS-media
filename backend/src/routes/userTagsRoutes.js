import express from 'express';

import {
    getUsedTags,
} from '../controllers/userTagsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsedTags);

export default router;
