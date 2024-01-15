import express from 'express';

import {
  postLogin,
  postSignup,
  postLogout,
  postForgotPassword,
  patchResetPassword,
} from '../controllers/authController.js';
import {
  loginValidation,
  signupValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/login', loginValidation, postLogin);

router.post('/signup', signupValidation, postSignup);

router.post('/logout', postLogout);

router.post('/forgot-password', forgotPasswordValidation, postForgotPassword);

router.patch(
  '/reset-password/:token',
  resetPasswordValidation,
  patchResetPassword
);

export default router;
