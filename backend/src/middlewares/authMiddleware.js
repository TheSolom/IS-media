import jwt from 'jsonwebtoken';

import CustomError from '../utils/errorHandling.js';
import * as parseUtil from '../utils/parseUtil.js';
import TokenBlacklistModel from '../models/tokenBlacklistModel.js';

export default async (req, _res, next) => {
    try {
        const { cookie } = req.headers;

        if (!cookie)
            throw new CustomError('You must be logged in', 401);

        const parsedCookies = parseUtil.parseCookies(cookie);

        const tokenBlacklist = new TokenBlacklistModel();

        const [TokenBlacklisted] = await tokenBlacklist.find({ token: parsedCookies.jwt });

        if (TokenBlacklisted.length)
            throw new CustomError('Login expired', 401);

        const { id } = jwt.verify(parsedCookies.jwt, process.env.JWT_SECRET);

        req.userId = id;

        next();
    } catch (error) {
        console.error(error);
        next(error.status === 401 ? error : new CustomError('Something went wrong while authenticating', 500));
    }
};
