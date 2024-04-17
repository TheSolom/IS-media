import express from 'express';

import {
    getUserStories,
    getFeedStories,
    getStory,
    postStory,
    deleteStory,
} from '../controllers/storyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/user', getUserStories);

router.get('/feed', getFeedStories);

router.get('/:storyId', getStory);

router.post('/', postStory);

router.delete('/:storyId', deleteStory);

export default router;
