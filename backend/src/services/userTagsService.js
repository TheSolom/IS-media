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
    if (!tagsIds || !tagsIds.length) {
        return {
            success: false,
            message: 'No tags provided',
            status: 400,
        };
    }

    const userTagsModel = new UserTagsModel();

    try {
        const incrementTagsPromises = tagsIds.map(async (tagId) =>
            userTagsModel.incrementUsedTag(userId, tagId)
        );

        const incrementTagsResults = await Promise.allSettled(incrementTagsPromises);

        const rejectedPromises = incrementTagsResults.filter(
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

export const deleteUserTag = async (tagsRows, userId) => {
    if (!tagsRows || !tagsRows.length) {
        return {
            success: false,
            message: 'No tags provided',
            status: 400,
        };
    }

    const userTagsModel = new UserTagsModel();

    try {
        const decrementTagsPromises = tagsRows.map(async ({ tag_id: tagId }) => {
            const [{ affectedRows }] = await userTagsModel.decrementUsedTag(userId, tagId);

            if (affectedRows)
                await userTagsModel.delete({ user_id: userId, tag_id: tagId, count: 0 });
        });

        const decrementTagsResults = await Promise.allSettled(decrementTagsPromises);

        const rejectedPromises = decrementTagsResults.filter(
            (promise) => promise.status === 'rejected'
        );

        if (rejectedPromises.length) {
            console.error('Some user tags failed to be deleted:', rejectedPromises);
            return {
                success: false,
                message: 'Failed to delete some user tags',
                status: 500,
            };
        }

        return {
            success: true,
            message: 'Successfully deleted user tags',
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while deleting user tags',
            status: 500,
        };
    }
};