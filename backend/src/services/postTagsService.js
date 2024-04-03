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

export const getTagPosts = async (tag, lastId, limit) => {
    const postTagsModel = new PostTagsModel();

    try {
        const [postsRows] = await postTagsModel.findTagPosts(tag, lastId, limit);

        const id = postsRows[0] ? postsRows[0].post_tag_id : 0;

        return {
            success: true,
            lastId: id,
            posts: postsRows
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
