import { validationResult } from 'express-validator';

import CustomError from '../utils/errorHandling.js';
import * as authService from '../services/authService.js';
import signUploadForm from '../utils/cloudinarySignature.js';

export async function postLogin(req, res, next) {
    const MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds
    const { emailOrUsername, password } = req.body;

    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, Signingup data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const loginResult = await authService.loginUser(
            emailOrUsername,
            password,
            MAX_AGE
        );

        if (!loginResult.success)
            throw new CustomError(loginResult.message, loginResult.status);

        res.setHeader(
            'Set-Cookie',
            `jwt=${loginResult.token}; Path=/; Max-Age= ${MAX_AGE}; HttpOnly; SameSite=None; Secure;`
        );

        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            userId: loginResult.userId,
        });
    } catch (error) {
        error.error = errors.array()[0]?.msg;
        next(error);
    }
}

export async function postSignup(req, res, next) {
    const { firstname, lastname, username, email, password, birthDate, gender } =
        req.body;

    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, Signingup data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const signupResult = await authService.signupUser(
            firstname,
            lastname,
            username,
            email,
            password,
            birthDate,
            gender
        );

        if (!signupResult.success)
            throw new CustomError(signupResult.error, signupResult.status);

        res.status(201).json({
            success: true,
            message: 'Successfully signed up',
            userId: signupResult.createResult.insertId,
        });
    } catch (error) {
        error.error = errors.array()[0]?.msg;
        next(error);
    }
}

export async function postLogout(req, res, next) {
    try {
        if (!req.headers.cookie)
            throw new CustomError('You must be logged in', 401);

        const logoutResult = await authService.logoutUser(req.headers.cookie);

        if (!logoutResult.success)
            throw new CustomError(logoutResult.message, logoutResult.status);

        res
            .clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                path: '/',
            })
            .status(200)
            .json({ success: true, message: 'Successfully logged out' });
    } catch (error) {
        next(error);
    }
}

export async function postForgotPassword(req, res, next) {
    const MAX_AGE = 60 * 60 * 1000; // 60 minutes in milliseconds
    const { emailOrUsername } = req.body;

    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, form data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const forgotPasswordResult = await authService.forgotPassword(
            emailOrUsername,
            MAX_AGE
        );

        if (!forgotPasswordResult.success)
            throw new CustomError(
                forgotPasswordResult.message,
                forgotPasswordResult.status
            );

        res.status(201).json({
            success: true,
            message: 'Successfully sent password reset link to email',
            id: forgotPasswordResult.info.messageId,
        });
    } catch (error) {
        next(error);
    }
}

export async function patchResetPassword(req, res, next) {
    const { token } = req.params;
    const { password } = req.body;

    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            throw new CustomError(
                'Validation failed, form data is incorrect',
                422,
                errors.array()[0].msg
            );
        }

        const resetPasswordResult = await authService.resetPassword(
            token,
            password
        );

        if (!resetPasswordResult.success)
            throw new CustomError(
                resetPasswordResult.message,
                resetPasswordResult.status
            );

        res.status(200).json({
            success: true,
            message: 'Successfully reset password',
        });
    } catch (error) {
        next(error);
    }
}

export async function getUploadSignature(req, res, next) {
    const { timestamp, signature } = signUploadForm();

    res.status(200).json({
        signature,
        timestamp,
        cloudname: process.env.CLOUDINARY_NAME,
        apikey: process.env.CLOUDINARY_API_KEY,
    });
}
