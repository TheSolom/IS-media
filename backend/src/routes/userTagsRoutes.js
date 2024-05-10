import express from 'express';

import getMostUsedTags from '../controllers/userTagsController.js';
import cursorPaginationValidation from '../validations/cursorPaginationValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/most-used-tags', cursorPaginationValidation, getMostUsedTags);

export default router;
