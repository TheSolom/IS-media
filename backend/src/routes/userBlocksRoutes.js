import express from 'express';

import {
    getUserBlocks,
    getUserBlockStatus,
    postUserBlock,
    deleteUserBlock,
} from '../controllers/userBlocksController.js';
import {
    getUserBlockStatusValidation,
    postUserBlockValidation,
    deleteUserBlockValidation,
} from '../validations/userBlocksValidation.js';
import cursorPaginationValidation from '../validations/cursorPaginationValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUserBlockStatusValidation, getUserBlockStatus);

router.get('/', cursorPaginationValidation, getUserBlocks);

router.post('/', postUserBlockValidation, postUserBlock);

router.delete('/:blockedId', deleteUserBlockValidation, deleteUserBlock);

export default router;
