import CustomError from '../utils/errorHandling.js';
import * as storyService from '../services/storyService.js';

export async function getStory(req, res, next) {
    const storyId = Number(req.params.storyId);

    try {
        if (!storyId || storyId < 1)
            throw new CustomError('No valid story id is provided', 400);

        const getStoryResult = await storyService.getStory(storyId);

        if (!getStoryResult.success)
            throw new CustomError(getStoryResult.message, getStoryResult.status);

        res.status(200).json({
            success: true,
            story: getStoryResult.story
        });
    } catch (error) {
        next(error);
    }
}

export async function postStory(req, res, next) {
    const { content } = req.body;

    try {
        if (!content)
            throw new CustomError('No content is provided', 400);

        const postStoryResult = await storyService.postStory(
            content,
            req.userId
        );

        if (!postStoryResult.success)
            throw new CustomError(postStoryResult.message, postStoryResult.status);

        res.status(201).json({
            success: true,
            message: 'Successfully created story',
            storyId: postStoryResult.createResult.insertId,
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteStory(req, res, next) {
    const storyId = Number(req.params.storyId);

    try {
        if (!storyId || storyId < 1)
            throw new CustomError('No valid story id is provided', 400);

        const deleteStoryResult = await storyService.deleteStory(
            storyId,
            req.userId
        );

        if (!deleteStoryResult.success)
            throw new CustomError(
                deleteStoryResult.message,
                deleteStoryResult.status
            );

        res.status(200).json({
            success: true,
            message: 'Successfully deleted story',
        });
    } catch (error) {
        next(error);
    }
}

export async function getFeedStories(req, res, next) {
    const lastId = Number(req.query.lastId) || 0;
    const limit = Number(req.query.limit) || 10;

    try {
        const getFeedStoriesResult = await storyService.getFeedStories(
            req.userId,
            lastId,
            limit
        );

        if (!getFeedStoriesResult.success)
            throw new CustomError(
                getFeedStoriesResult.message,
                getFeedStoriesResult.status
            );

        res.status(getFeedStoriesResult.stories.length ? 200 : 204).json({
            success: true,
            lastId: getFeedStoriesResult.lastId,
            stories: getFeedStoriesResult.stories,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserStories(req, res, next) {
    const lastId = Number(req.query.lastId) || 0;
    const limit = Number(req.query.limit) || 10;

    const userId = Number(req.params.userId);

    try {
        if (!userId || userId < 1)
            throw new CustomError('No valid user id is provided', 400);

        const getUserStoriesResult = await storyService.getUserStories(
            userId,
            lastId,
            limit
        );

        if (!getUserStoriesResult.success)
            throw new CustomError(
                getUserStoriesResult.message,
                getUserStoriesResult.status
            );

        res.status(getUserStoriesResult.stories.length ? 200 : 204).json({
            success: true,
            lastId: getUserStoriesResult.lastId,
            stories: getUserStoriesResult.stories
        });
    } catch (error) {
        next(error);
    }
}