import express from 'express';

import {
    getUser,
    updateUser,
    isUserFollowee,
    getUserFollowers,
    isUserFollower,
    getUserFollowings,
    postUserFollow,
    deleteUserFollow,
    getUserBlocks,
    getUserBlockStatus,
    postUserBlock,
    deleteUserBlock,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import updateUserValidation from '../validations/userValidation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile/:userId', getUser);

router.patch('/profile', updateUserValidation, updateUser);

router.get('/followers/:followerId', isUserFollowee);

router.get('/followers', getUserFollowers);

router.get('/followings/:followeeId', isUserFollower);

router.get('/followings', getUserFollowings);

router.post('/followings', postUserFollow);

router.delete('/followings/:followeeId', deleteUserFollow);

router.get('/blocks', getUserBlocks);

router.get('/blocks/:userId', getUserBlockStatus);

router.post('/block', postUserBlock);

router.delete('/block/:blockedId', deleteUserBlock);

export default router;
