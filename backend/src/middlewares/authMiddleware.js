import jwt from 'jsonwebtoken';

import CustomError from '../utils/errorHandling.js';
import parseCookies from '../utils/parseCookies.js';
import TokenBlacklistModel from '../models/tokenBlacklistModel.js';

export default async (req, _res, next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) throw new CustomError('You must be logged in', 401);

    const parsedCookies = parseCookies(cookies);

    const tokenBlacklist = new TokenBlacklistModel();
    const isTokenBlacklisted = await tokenBlacklist.findByToken(
      parsedCookies.jwt
    );

    if (isTokenBlacklisted.length) throw new CustomError('Login expired', 401);

    const { id } = jwt.verify(parsedCookies.jwt, process.env.JWT_SECRET);
    
    req.userId = id;

    next();
  } catch (error) {
    next(error);
  }
};
