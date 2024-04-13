import isValidUrl from '../utils/isValidUrl.js';

export const exportPostTags = async (postTitle, postContent) => {
    const tags = isValidUrl(postContent) ?
        postTitle.match(/#([^#\s]+)/g) : postContent.match(/#([^#\s]+)/g);

    return tags;
};