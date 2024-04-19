import { NextFunction, Request, Response } from 'express';
import userModel, { UserList, UserSchema } from '../models/userModel';
import { userTrim } from '../../utils/users';
import resetPasswordModel, {
  ResetPasswordSchema,
} from '../models/resetPasswordModel';
import {
  Result,
  ValidationError,
  cookie,
  validationResult,
} from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import sendVerification, {
  sendResetPasswordCodeByEmail,
} from '../../utils/mailer';
import randomstring from 'randomstring';
import ErrorHandler from '../../middlewares/errorHandler';

dotenv.config();

// Fetch list of doctors
export const getDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find doctors with role=Doctor
    const foundUser = await userModel.find<UserSchema | undefined>({
      role: 'Doctor',
    });
    // Doctor dose not exit
    if (!foundUser) {
      // return res.status(401).json({ error: 'DoctorsIsEmpty' });
      // OR
      return next(new ErrorHandler('DoctorsIsEmpty', 401));
    }
    // Trim unneccessary fields
    // send doctor's list
    if (foundUser.length > 0) {
      const resultUserList: UserList[] | undefined = userTrim(
        foundUser as UserSchema[]
      );
      return res.json({ success: true, resultUserList });
    } else {
      return res.json({ success: true, resultUserList: [] });
    }
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

export const getAccountDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: req.body.email,
    });
    // Email address dose not exit
    if (!foundUser) {
      // return res.status(401).json({ error: 'EmailDoseNotExist' });
      // OR
      return next(new ErrorHandler('EmailDoseNotExist', 401));
    }
    // send user information to client
    return res.json({
      success: true,
      user: {
        fname: foundUser.fname,
        lname: foundUser.lname,
        email: foundUser.email,
        username: foundUser.username,
        image: foundUser.image,
        avatar: foundUser.avatar,
        gender: foundUser.gender,
        phone: foundUser.phone,
        mobile: foundUser.mobile,
        address: foundUser.address,
        birth_year: foundUser.birth_year,
        birth_month: foundUser.birth_month,
        birth_day: foundUser.birth_day,
        role: foundUser.role,
        department: foundUser.department,
        verify: foundUser.verify,
      },
    });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};
