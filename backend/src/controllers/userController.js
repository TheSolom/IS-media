import * as userService from '../services/userService.js';
import CustomError from '../utils/errorHandling.js';
import requestValidation from '../utils/requestValidation.js';

export async function searchUser(req, res, next) {
    const { username } = req.params;
    const { limit } = req.query;

    try {
        requestValidation(req);

        const searchUserResult = await userService.searchUser(
            username,
            limit ?? 10
        );

        if (!searchUserResult.success)
            throw new CustomError(searchUserResult.message, searchUserResult.status);

        res.status(searchUserResult.users.length ? 200 : 404).json({
            success: true,
            users: searchUserResult.users,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUser(req, res, next) {
    const userId = Number(req.params.userId);

    try {
        if (!userId || userId < 1)
            throw new CustomError('No valid user id is provided', 422);

        const getUserResult = await userService.getUser(userId);

        if (!getUserResult.success)
            throw new CustomError(getUserResult.message, getUserResult.status);

        res.status(200).json({
            success: true,
            user: getUserResult.user,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req, res, next) {
    try {
        requestValidation(req);

        const getUpdateUserResult = await userService.updateUser(
            req.userId,
            req.body
        );

        if (!getUpdateUserResult.success)
            throw new CustomError(getUpdateUserResult.message, getUpdateUserResult.status);

        res.status(200).json({
            success: true,
            message: `Successfully updated user with id '${req.userId}' `,
        });
    } catch (error) {
        next(error);
    }
}
