import bcrypt from 'bcrypt';

import UserModel from '../models/userModel.js';
import UserFollowersModel from '../models/userFollowersModel.js';
import UserBlocksModel from '../models/userBlocksModel.js';

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
    const updatedData = { ...data };

    if (updatedData.password) {
        try {
            updatedData.password = await bcrypt.hash(updatedData.password, 10);
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: 'Failed to hash password',
                status: 500,
            };
        }
    }

    const userModel = new UserModel();

    try {
        const updateResult = await userModel.update(updatedData, { id: userId });

        if (!updateResult.affectedRows) {
            return {
                success: false,
                message: 'Failed to update the user',
                status: 500,
            };
        }

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
            followers: followeesRows,
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

export const postUserFollow = async (followeeId, followerId) => {
    const userFollowersModel = new UserFollowersModel();

    try {
        const createResult = await userFollowersModel.create({ userId: followeeId, followerId });

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
        const deleteResult = await userFollowersModel.delete({ userId: followeeId, followerId });

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

export const postUserBlock = async (blockedId, blockerId) => {
    const userBlocksModel = new UserBlocksModel();

    try {
        const createResult = await userBlocksModel.create({ userId: blockedId, blockerId });

        if (!createResult.affectedRows)
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
            message: 'An error occurred while blocking the user',
            status: 500,
        };
    }
};

export const deleteUserBlock = async (blockedId, blockerId) => {
    const userBlocksModel = new UserBlocksModel();

    try {
        const deleteResult = await userBlocksModel.delete({ userId: blockedId, blockerId });

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
