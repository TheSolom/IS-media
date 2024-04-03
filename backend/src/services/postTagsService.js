import PostTagsModel from '../models/postTagsModel.js';

export const getPostTags = async (postId) => {
    const postTagsModel = new PostTagsModel();

    try {
        const [tagsRows] = await postTagsModel.findPostTags(postId);

        return {
            success: true,
            tags: tagsRows
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the posts',
            status: 500,
        };
    }
};
