import express from 'express';

import {
    isUserFollowee,
    getUserFollowers,
    isUserFollower,
    getUserFollowings,
    getUserFollowSuggestions,
    postUserFollow,
    deleteUserFollow,
} from '../controllers/userFollowsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/followers/:followerId', isUserFollowee);

router.get('/followers', getUserFollowers);

router.get('/followings/:followeeId', isUserFollower);

router.get('/followings', getUserFollowings);

router.get('/suggested-followings', getUserFollowSuggestions);

router.post('/followings', postUserFollow);

router.delete('/followings/:followeeId', deleteUserFollow);

export default router;
