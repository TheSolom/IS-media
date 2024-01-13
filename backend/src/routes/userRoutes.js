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

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUser);

router.patch('/', updateUser);

router.get('/followers', getUserFollowers);

router.get('/followings', getUserFollowings);

router.put('/follow/:followeeId', putUserFollow);

router.delete('/follow/:followeeId', deleteUserFollow);

export default router;
