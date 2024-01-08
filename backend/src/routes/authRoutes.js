import express from 'express';

import {
  postLogin,
  postSignup,
  postLogout,
  // postReset,
  // getNewPassword,
  // postNewPassword,
} from '../controllers/authController.js';
import {
  loginValidation,
  signupValidation,
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/login', loginValidation, postLogin);

router.post('/signup', signupValidation, postSignup);

router.post('/logout', postLogout);

// router.post('/reset', postReset);

// router.get('/reset/:token', getNewPassword);

// router.post('/new-password', postNewPassword);

export default router;
