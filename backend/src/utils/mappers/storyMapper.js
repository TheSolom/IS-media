const storyMapper = (storyRow) =>
    storyRow.map((story) => (
        {
            storyId: story.id,
            content: story.content,
            createdAt: story.created_at,
            author: {
                id: story.author_id,
                username: story.username,
                profilePicture: story.profile_picture
            },
        }
    ));

export default storyMapper;