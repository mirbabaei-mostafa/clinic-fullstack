import express, { Router } from 'express';
import authValidator from '../validators/authValidator';
import registerValidator from '../validators/registerValidator';
import findUserValidator from '../validators/findUserValidator';
import {
  authUser,
  cancelResetPassword,
  findAccountByEmail,
  registerUser,
  renewToken,
  resendVerification,
  resetPassword,
  sendResetPasswordCode,
  signOut,
  verifyResetCode,
  verifyUser,
} from '../db/controllers/userController';
import JWTVerification from '../middlewares/jwt';
import changePasswordValidator from '../validators/changePasswordValidator';
import upload from '../middlewares/multer';

const userRouter: Router = express.Router();

const cpUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);

// Public routes
userRouter.post('/register', cpUpload, registerValidator, registerUser);
// userRouter.post('/register', registerValidator, registerUser);
userRouter.post('/auth', authValidator, authUser);
userRouter.get('/signout', signOut);
userRouter.get('/renew', renewToken);
userRouter.post('/finduser', findUserValidator, findAccountByEmail);
userRouter.post('/sendresetcode', findUserValidator, sendResetPasswordCode);
userRouter.post('/verifyresetcode', findUserValidator, verifyResetCode);
userRouter.post('/cancelresetcode', findUserValidator, cancelResetPassword);
userRouter.post('/changepassword', changePasswordValidator, resetPassword);

// Peotected routes
userRouter.use(JWTVerification);
userRouter.post('/activate', verifyUser);
userRouter.post('/resendverification', resendVerification);

export default userRouter;
