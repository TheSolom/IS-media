import express from 'express';

import {
    getStory,
    postStory,
    deleteStory,
    getFeedStories,
    getUserStories,
} from '../controllers/storyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/story/:storyId', getStory);

router.post('/story', postStory);

router.delete('/story/:storyId', deleteStory);

router.get('/user/feed', getFeedStories);

router.get('/user/:userId', getUserStories);

export default router;
