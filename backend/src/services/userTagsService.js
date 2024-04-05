import UserTagsModel from '../models/userTagsModel.js';

export const getUsedTags = async (userId, limit) => {
    const userTagsModel = new UserTagsModel();

    try {
        const [usedTagsRow] = await userTagsModel.findUsedTags(userId, limit);

        if (!usedTagsRow.length)
            return {
                success: false,
                message: 'No used tags found',
                status: 404,
            };

        return { success: true, tags: usedTagsRow[0] };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the tags',
            status: 500,
        };
    }
};
