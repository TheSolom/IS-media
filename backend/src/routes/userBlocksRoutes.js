import { Router } from 'express';

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

const router = Router();

router.use(authMiddleware);

router.get('/blocks/:userId/status', getUserBlockStatusValidation, getUserBlockStatus);

router.get('/blocks', cursorPaginationValidation, getUserBlocks);

router.post('/blocks', postUserBlockValidation, postUserBlock);

router.delete('/blocks/:blockedId', deleteUserBlockValidation, deleteUserBlock);

export default router;
