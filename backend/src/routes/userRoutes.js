import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getUser,
  updateUser,
  getUserFollowers,
  getUserFollowings,
  putUserFollow,
  deleteUserFollow,
} from '../controllers/userController.js';
import updateUserValidation from '../validations/userValidation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile/:username', getUser);

router.patch('/profile', updateUserValidation, updateUser);

router.get('/followers', getUserFollowers);

router.get('/followings', getUserFollowings);

router.put('/follow/:followeeId', putUserFollow);

router.delete('/follow/:followeeId', deleteUserFollow);

export default router;
