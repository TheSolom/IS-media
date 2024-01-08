import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import { getUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUser);

router.patch('/:userId', updateUser);

export default router;
