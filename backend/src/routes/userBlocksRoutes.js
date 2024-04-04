import express from 'express';

import {
    getUserBlocks,
    getUserBlockStatus,
    postUserBlock,
    deleteUserBlock,
} from '../controllers/userBlocksController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUserBlockStatus);

router.get('/', getUserBlocks);

router.post('/', postUserBlock);

router.delete('/:blockedId', deleteUserBlock);

export default router;
