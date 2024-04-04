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

router.get('/:storyId', getStory);

router.post('/', postStory);

router.delete('/:storyId', deleteStory);

router.get('/feed', getFeedStories);

router.get('/user', getUserStories);

export default router;
