import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import isEmail from 'validator/lib/isEmail.js';

import * as parseUtil from '../utils/parseUtil.js';
import UserModel from '../models/userModel.js';
import TokenBlacklistModel from '../models/tokenBlacklistModel.js';
import TokenModel from '../models/tokenModel.js';
import transporter from '../configs/transporter.js';

const createToken = (userId, username, MAX_AGE) => {
    try {
        const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
            expiresIn: MAX_AGE,
        });

        return { success: true, token };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};

export const loginUser = async (emailOrUsername, password, MAX_AGE) => {
    const userModel = new UserModel();

    let userRow;
    try {
        if (isEmail(emailOrUsername)) {
            const email = emailOrUsername;
            [userRow] = await userModel.find({ email });
        } else {
            const username = emailOrUsername;
            [userRow] = await userModel.find({ username });
        }

        if (!userRow.length)
            return {
                success: false,
                message: 'Incorrect username or email or password. Please try again',
                status: 401,
            };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while logging in the user',
            status: 500,
        };
    }

    try {
        const isPasswordMatch = await bcrypt.compare(password, userRow[0].password);

        if (!isPasswordMatch)
            return {
                success: false,
                message: 'Incorrect username or email or password. Please try again',
                status: 401,
            };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while logging in the user',
            status: 500,
        };
    }

    const createTokenResult = createToken(
        userRow[0].id,
        userRow[0].username,
        MAX_AGE
    );

    if (!createTokenResult.success)
        return {
            success: false,
            message: 'An error occurred while logging in the user',
            status: 500,
        };

    return {
        success: true,
        token: createTokenResult.token,
        userId: userRow[0].id,
    };
};

export const signupUser = async (
    firstname,
    lastname,
    username,
    email,
    password,
    birthDate,
    gender
) => {
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while signing up the user',
            status: 500,
        };
    }

    const newUser = {
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        birth_date: birthDate,
        gender,
    };

    const userModel = new UserModel();

    try {
        const createResult = await userModel.create(newUser);

        return { success: true, createResult };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while signing up the user',
            status: 500,
        };
    }
};

export const logoutUser = async (cookies) => {
    const parsedCookies = parseUtil.parseCookies(cookies);

    const { userId, exp } = parseUtil.parseJwt(parsedCookies.jwt);

    const tokenBlacklist = new TokenBlacklistModel();
    try {
        await tokenBlacklist.create({
            token: parsedCookies.jwt,
            expiration_date: new Date(exp * 1000),
        });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while logging out the user',
            status: 500,
        };
    }

    return {
        success: true,
        message: 'User logged out successfully',
        status: 200
    };
};

export const forgotPassword = async (emailOrUsername, MAX_AGE) => {
    const userModel = new UserModel();

    let userRow;
    try {
        if (isEmail(emailOrUsername)) {
            const email = emailOrUsername;
            [userRow] = await userModel.find({ email });
        } else {
            const username = emailOrUsername;
            [userRow] = await userModel.find({ username });
        }

        if (!userRow.length)
            return {
                success: false,
                message: 'Incorrect email. Please try again',
                status: 401,
            };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while verifying the user',
            status: 500,
        };
    }

    const token = crypto.randomBytes(32).toString('hex');

    const tokenModel = new TokenModel();

    try {
        await tokenModel.create({
            user_id: userRow[0].id,
            token,
            expiration_date: new Date(Date.now() + MAX_AGE),
        });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while resetting the password',
            status: 500,
        };
    }

    const resetUrl = `https://is-media.onrender.com/reset-password/${token}`;

    const mailOptions = {
        from: 'onboarding@resend.dev',
        to: userRow[0].email,
        subject: 'IS Media Password reset',
        text: `You requested a password reset.

      For resetting your password please click on the link below: 
      ${resetUrl} 
      If you did not request a password reset, please ignore this email.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            info
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while sending the password reset email',
            status: 500,
        };
    }
};

export const resetPassword = async (token, password) => {
    const tokenModel = new TokenModel();

    let tokenRow;
    try {
        [tokenRow] = await tokenModel.find({ token });

        if (!tokenRow.length)
            return {
                success: false,
                message: 'Invalid or expired token. Please try again',
                status: 401,
            };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while resetting the password',
            status: 500,
        };
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while resetting the password',
            status: 500,
        };
    }
    const userModel = new UserModel();

    try {
        const updateResult = await userModel.update(
            { password: hashedPassword },
            { id: tokenRow[0].user_id }
        );

        if (!updateResult.affectedRows)
            return {
                success: false,
                message: 'Failed to update password',
                status: 401,
            };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while resetting the password',
            status: 500,
        };
    }

    try {
        await tokenModel.delete({ token });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'An error occurred while resetting the password',
            status: 500,
        };
    }

    return { success: true };
};
