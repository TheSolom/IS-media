import { Router } from 'express';

import {
    postLogin,
    postSignup,
    postLogout,
    postForgotPassword,
    patchResetPassword,
    getUploadSignature,
} from '../controllers/authController.js';
import {
    loginValidation,
    signupValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} from '../validations/authValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', loginValidation, postLogin);

router.post('/signup', signupValidation, postSignup);

router.post('/logout', postLogout);

router.post('/forgot-password', forgotPasswordValidation, postForgotPassword);

router.patch(
    '/reset-password/:token',
    resetPasswordValidation,
    patchResetPassword
);

router.get('/uploadSignature', authMiddleware, getUploadSignature);

export default router;
