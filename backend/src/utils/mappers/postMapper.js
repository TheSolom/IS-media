const postMapper = (postRow) =>
    postRow.map((post) => (
        {
            postId: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            author: {
                id: post.author_id,
                username: post.username,
                profilePicture: post.profile_picture
            },
            parentPost: post.parent_id ? {
                title: post.parent_title,
                content: post.parent_content,
                createdAt: post.parent_created_at,
                author: {
                    id: post.parent_author_id,
                    username: post.parent_username,
                    profilePicture: post.parent_profile_picture
                }
            } : null
        }
    ));

export default postMapper;