import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userService.js';

export async function getUser(req, res, next) {
    const userId = Number(req.params.userId);

    try {
        if (!userId || userId < 1)
            throw new CustomError('No valid user id is provided', 400);

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
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, updating data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const getUpdateUserResult = await userService.updateUser(
            req.userId,
            req.body
        );

        if (!getUpdateUserResult.success)
            throw new CustomError(
                getUpdateUserResult.message,
                getUpdateUserResult.status
            );

        res.status(200).json({
            success: true,
            message: `Successfully updated user with id '${req.userId}' `,
        });
    } catch (error) {
        next(error);
    }
}

export async function searchUser(req, res, next) {
    const { username } = req.params;
    const { limit } = req.query;

    try {
        if (!username)
            throw new CustomError('No valid username is provided', 400);

        if (limit !== undefined && (Number.isNaN(limit) || limit === null || limit < 1))
            throw new CustomError('No valid limit is provided', 400);

        const searchUserResult = await userService.searchUser(
            username,
            limit ?? 10
        );

        if (!searchUserResult.success)
            throw new CustomError(searchUserResult.message, searchUserResult.status);

        res.status(200).json({
            success: true,
            users: searchUserResult.users,
        });
    } catch (error) {
        next(error);
    }
}
