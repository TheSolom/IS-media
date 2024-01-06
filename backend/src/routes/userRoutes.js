import express from 'express';

import { getUser, updateUser } from '../controllers/userController.js';
import { signupValidation } from '../validations/authValidation.js';

const router = express.Router();

router.get('/user/:userId', getUser);

router.patch('/user/:userId', updateUser);

export default router;
