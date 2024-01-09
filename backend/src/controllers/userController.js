import CustomError from '../utils/errorHandling.js';
import * as userService from '../services/userService.js';

export async function getUser(req, res, next) {
  let { userId } = req.params;
  userId = Number(userId);

  try {
    if (!userId || typeof userId !== 'number')
      throw new CustomError('No valid user id is provided', 400);

    if (userId !== Number(req.userId))
      throw new CustomError(
        'Unauthorized, you can only access your profile',
        401
      );

    const user = await userService.getUser(userId);

    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  const { body } = req;
  
  let { userId } = req.params;
  userId = Number(userId);

  try {
    if (!userId || typeof userId !== 'number')
      throw new CustomError('No valid user id is provided', 400);

    if (userId !== Number(req.userId))
      throw new CustomError(
        'Unauthorized, you can only access your profile',
        401
      );

    if (Object.keys(body).length === 0)
      throw new CustomError('No data provided', 400);

    const allowedProperties = [
      'firstname',
      'lastname',
      'username',
      'email',
      'password',
      'about',
      'profilePicture',
      'coverPicture',
      'country',
      'livesIn',
      'relationship',
    ];

    Object.keys(body).forEach((key) => {
      if (!allowedProperties.includes(key))
        throw new CustomError('Wrong data provided', 400);
    });

    const info = await userService.updateUser(userId, body);

    res.status(201).json({
      success: true,
      message: 'Successfully updated user',
      info,
    });
  } catch (error) {
    next(error);
  }
}
