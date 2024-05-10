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
import {
    isUserFolloweeValidation,
    getUserFollowersValidation,
    isUserFollowerValidation,
    getUserFollowingsValidation,
    postUserFollowValidation,
    deleteUserFollowValidation,
} from '../validations/userFollowsValidation.js';
import cursorPaginationValidation from '../validations/cursorPaginationValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/followers/:followerId', isUserFolloweeValidation, isUserFollowee);

router.get('/followers', cursorPaginationValidation, getUserFollowersValidation, getUserFollowers);

router.get('/followings/:followeeId', isUserFollowerValidation, isUserFollower);

router.get('/followings', cursorPaginationValidation, getUserFollowingsValidation, getUserFollowings);

router.get('/suggested-followings', cursorPaginationValidation, getUserFollowSuggestions);

router.post('/followings', postUserFollowValidation, postUserFollow);

router.delete('/followings/:followeeId', deleteUserFollowValidation, deleteUserFollow);

export default router;
