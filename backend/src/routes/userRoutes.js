import express from 'express';

import {
    getUser,
    updateUser,
    getUserFollowers,
    getUserFollowings,
    postUserFollow,
    deleteUserFollow,
    getUserBlocks,
    postUserBlock,
    deleteUserBlock,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import updateUserValidation from '../validations/userValidation.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile/:userId', getUser);

router.patch('/profile', updateUserValidation, updateUser);

router.get('/followers', getUserFollowers);

router.get('/followings', getUserFollowings);

router.post('/follow/:followeeId', postUserFollow);

router.delete('/follow/:followeeId', deleteUserFollow);

router.get('/blocks/', getUserBlocks);

router.post('/block/:blockedId', postUserBlock);

router.delete('/block/:blockedId', deleteUserBlock);

export default router;
