import UserTagsModel from '../models/userTagsModel.js';

export const getUsedTags = async (userId, limit) => {
    const userTagsModel = new UserTagsModel();

    try {
        const [usedTagsRows] = await userTagsModel.findUsedTags(userId, limit);

        if (!usedTagsRows.length)
            return {
                success: false,
                message: 'No used tags found',
                status: 404,
            };

        return { success: true, tags: usedTagsRows };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the tags',
            status: 500,
        };
    }
};

export const putUserTag = async (tagsIds, userId) => {
    if (!tagsIds) {
        return {
            success: false,
            message: 'No tags provided',
            status: 400,
        };
    }

    const userTagsModel = new UserTagsModel();

    try {
        const createTagsPromises = tagsIds.map(async (tagId) =>
            userTagsModel.createOrUpdateUsedTag(userId, tagId)
        );

        const createOrUpdateTagsResults = await Promise.allSettled(createTagsPromises);

        const rejectedPromises = createOrUpdateTagsResults.filter(
            (promise) => promise.status === 'rejected'
        );

        if (rejectedPromises.length) {
            console.error('Some tags failed to be added to the user:', rejectedPromises);
            return {
                success: false,
                message: 'Failed to add some tags to the user',
                status: 500,
            };
        }

        return {
            success: true,
            message: 'Successfully added tags to the user',
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while adding user tags',
            status: 500,
        };
    }
};
