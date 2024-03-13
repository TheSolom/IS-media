import bcrypt from 'bcrypt';

import UserModel from '../models/userModel.js';
import UserFollowersModel from '../models/userFollowersModel.js';
import UserBlocksModel from '../models/userBlocksModel.js';
import deleteMedia from '../utils/deleteMedia.js';

export const getUser = async (userId) => {
    const userModel = new UserModel();

    try {
        const [userRow] = await userModel.find({ id: userId });

        if (!userRow.length)
            return {
                success: false,
                message: `No user found with provided id '${userId}' `,
                status: 404,
            };

        delete userRow[0].password;

        const date = new Date(userRow[0].birth_date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        const datePart = date.toISOString().split('T')[0];
        userRow[0].birth_date = datePart;

        return { success: true, user: userRow[0] };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the user',
            status: 500,
        };
    }
};

export const updateUser = async (userId, data) => {
    const { birthDate, profilePicture, coverPicture, livesIn, worksAt, ...rest } = data;

    const renamedData = {
        ...rest,
        birth_date: birthDate,
        profile_picture: profilePicture,
        cover_picture: coverPicture,
        lives_in: livesIn,
        works_at: worksAt
    };

    if (renamedData.password) {
        try {
            renamedData.password = await bcrypt.hash(renamedData.password, 10);
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'An error occurred while updating the user',
                status: 500,
            };
        }
    }

    const userModel = new UserModel();

    try {
        const [userRow] = await userModel.find({ id: userId });

        if (!userRow.length)
            return {
                success: false,
                message: `No user found with provided id '${userId}' `,
                status: 404,
            };

        const updateResult = await userModel.update(renamedData, { id: userId });

        if (!updateResult.affectedRows) {
            return {
                success: false,
                message: 'Failed to update the user',
                status: 500,
            };
        }

        if (userRow[0].profile_picture !== profilePicture)
            await deleteMedia(userRow[0], 'profile_picture');

        if (userRow[0].cover_picture !== coverPicture)
            await deleteMedia(userRow[0], 'cover_picture');

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while updating the user',
            status: 500,
        };
    }
};

export const isUserFollowee = async (followerId, userId) => {
    const userFollowersModel = new UserFollowersModel();
    console.log(followerId, userId);

    try {
        const [followRow] = await userFollowersModel.find({ user_id: userId, follower_id: followerId });

        return { success: true, isFollowing: !!followRow.length };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the follow status',
            status: 500,
        };
    }
};

export const getUserFollowers = async (userId, lastId, limit) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const [followersRows] = await userFollowersModel.findFollowers(userId, lastId, limit);

        const id = followersRows[0] ? followersRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            followers: followersRows,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the followers',
            status: 500,
        };
    }
};

export const getUserFollowings = async (userId, lastId, limit) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const [followeesRows] = await userFollowersModel.findFollowees(userId, lastId, limit);

        const id = followeesRows[0] ? followeesRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            followings: followeesRows,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the followings',
            status: 500,
        };
    }
};

export const isUserFollower = async (followeeId, userId) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const [followRow] = await userFollowersModel.find({ user_id: followeeId, follower_id: userId });

        return { success: true, isFollowing: !!followRow.length };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the follow status',
            status: 500,
        };
    }
};


export const postUserFollow = async (followeeId, followerId) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const createResult = await userFollowersModel.create({ user_id: followeeId, follower_id: followerId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `Failed to follow the user with provided id '${followeeId}' `,
                status: 500,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while following the user',
            status: 500,
        };
    }
};

export const deleteUserFollow = async (followeeId, followerId) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const deleteResult = await userFollowersModel.delete({ user_id: followeeId, follower_id: followerId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No user found with provided id '${followeeId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while unfollowing the user',
            status: 500,
        };
    }
};

export const getUserBlocks = async (userId, lastId, limit) => {
    const userBlocksModel = new UserBlocksModel();

    try {
        const [blocksRows] = await userBlocksModel.findBlocks(userId, lastId, limit);

        const id = blocksRows[0] ? blocksRows[0].id : 0;

        return {
            success: true,
            lastId: id,
            blocks: blocksRows,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching user blocks',
            status: 500,
        };
    }
};

export const getUserBlockStatus = async (userId1, userId2) => {
    const userBlocksModel = new UserBlocksModel();

    try {
        const [blockRow] = await userBlocksModel.findUserBlockStatus(userId1, userId2);

        return { success: true, blockStatus: blockRow.length };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while fetching the block status',
            status: 500,
        };
    }
};

export const postUserBlock = async (blockedId, blockerId) => {
    const userBlocksModel = new UserBlocksModel();
    const userFollowersModel = new UserFollowersModel();

    try {
        const createResult = await userBlocksModel.create({ user_id: blockerId, blocked_id: blockedId });

        if (!createResult.affectedRows)
            return {
                success: false,
                message: `No user found with provided id '${blockedId}' `,
                status: 404,
            };

        await userFollowersModel.DeleteFollowStatus(blockedId, blockerId);

        return { success: true };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while blocking the user',
            status: 500,
        };
    }
};

export const deleteUserBlock = async (blockedId, blockerId) => {
    const userBlocksModel = new UserBlocksModel();

    try {
        const deleteResult = await userBlocksModel.delete({ user_id: blockerId, blocked_id: blockedId });

        if (!deleteResult.affectedRows)
            return {
                success: false,
                message: `No user found with provided id '${blockedId}' `,
                status: 404,
            };

        return { success: true };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while unblocking the user',
            status: 500,
        };
    }
};