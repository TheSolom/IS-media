import express from 'express';

import {
    getUser,
    updateUser,
    searchUser,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import updateUserValidation from '../validations/userValidation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile/:userId', getUser);

router.put('/profile', updateUserValidation, updateUser);

router.get('/search/:username', searchUser);

export default router;
