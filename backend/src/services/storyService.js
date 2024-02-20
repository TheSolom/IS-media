import StoryModel from '../models/storyModel.js';

export const getStory = async (storyId) => {
    const storyModel = new StoryModel();

    try {
        const [storyRow] = await storyModel.find({ id: storyId });

        if (!storyRow.length)
            return {
                success: false,
                message: `No story found with id '${storyId}' `,
                status: 404,
            };

        return {
            success: true,
            story: storyRow[0]
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while fetching the story',
            status: 500,
        };
    }
};


export const postStory = async (content, authorId) => {
    const storyModel = new StoryModel();

    try {
        const createResult = await storyModel.create({ content, author_id: authorId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `Failed to create story for user with id '${authorId}' `,
                status: 500,
            };

        return {
            success: true,
            createResult
        };
    } catch (error) {
        return {
            success: false,
            message: 'An error occurred while creating the story',
            status: 500,
        };
    }
};

export const deleteStory = async (storyId, authorId) => {
    const storyModel = new StoryModel();

    try {
        const deleteResult = await storyModel.update({ deleted_at: new Date() }, { id: storyId, author_id: authorId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No story found with id '${storyId}' for user with id '${authorId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while deleting the story',
            status: 500,
        };
    }
};

export const getFeedStories = async (userId, lastId, limit) => {
    const storyModel = new StoryModel();

    try {
        const [storyRows] = await storyModel.findFeedStories(userId, lastId, limit);

        const id = storyRows[0] ? storyRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            stories: storyRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the stories',
            status: 500,
        };
    }
};

export const getUserStories = async (userId, lastId, limit) => {
    const storyModel = new StoryModel();

    try {
        const [storyRows] = await storyModel.findUserStories(userId, lastId, limit);

        const id = storyRows[0] ? storyRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            stories: storyRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the stories',
            status: 500,
        };
    }
};