import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import {
  getUser,
  updateUser,
  getUserFollowers,
  // getFollowings,
  // putFollow,
} from '../controllers/userController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/:userId', getUser);

router.patch('/:userId', updateUser);

router.get('/:userId/followers', getUserFollowers);

// router.get('/:userId/followings', getFollowings);

// router.put('/:userId/follow/:followeeId', putFollow);

export default router;
