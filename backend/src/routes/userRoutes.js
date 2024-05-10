import express from 'express';

import {
    getUser,
    updateUser,
    searchUser,
} from '../controllers/userController.js';
import {
    updateUserValidation,
    searchUserValidation
} from '../validations/userValidation.js';
import cursorPaginationValidation from '../validations/cursorPaginationValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId/profile', getUser);

router.put('/profile', updateUserValidation, updateUser);

router.get('/search/:username', cursorPaginationValidation, searchUserValidation, searchUser);

export default router;
