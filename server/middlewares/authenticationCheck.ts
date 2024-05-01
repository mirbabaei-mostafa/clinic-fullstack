import { NextFunction, Request, Response } from 'express';
import catchAsyncError from './catchAsyncError';
import userModel, { UserSchema } from '../db/models/userModel';
import ErrorHandler from './errorHandler';
import jwt from 'jsonwebtoken';

const getUserRoll = async (token: string) => {
  try {
    const foundUser: UserSchema | null = await userModel.findOne({
      refresh_token: token,
    });

    jwt.verify(
      token,
      process.env.JWT_REFRESH_TOKEN as string,
      async (err: any, decoded: any) => {
        // If refresh token exist but user dose not exist
        // maybe app/website hacked then have to remove refresh token
        if (!foundUser) {
          if (err) return err.message as string;

          const hackedUser: any = await userModel.findOne({
            _id: (decoded as any).id,
          });
          if (hackedUser) {
            hackedUser.refresh_token = [];
            await hackedUser.updateOne();
          }
          return 'Forbiden';
        }

        // When occured an error and found user is diffrent with
        if (foundUser._id.toString() !== decoded.id.toString()) {
          return 'UserIsDiffrent';
        }
      }
    );
    // send user role
    return foundUser?.role as string;
  } catch (err: any) {
    return err.message as string;
  }
};

export const adminAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies?.auth_token) {
      const foundToken: any = await getUserRoll(req.cookies?.auth_token);
      if ((foundToken as string) === 'Admin') {
        next();
      } else {
        return next(new ErrorHandler(foundToken, 401));
      }
    } else {
      return next(new ErrorHandler('UserNotAuthorized', 401));
    }
  }
);

export const userAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies?.auth_token) {
      const foundToken: any = getUserRoll(req.cookies?.auth_token);
      if ((foundToken as string) === 'User') {
        next();
      } else {
        return next(new ErrorHandler(foundToken, 401));
      }
    } else {
      return next(new ErrorHandler('UserNotAuthorized', 401));
    }
  }
);

export const doctorAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies?.auth_token) {
      const foundToken: any = getUserRoll(req.cookies?.auth_token);
      if ((foundToken as string) === 'Doctor') {
        next();
      } else {
        return next(new ErrorHandler(foundToken, 401));
      }
    } else {
      return next(new ErrorHandler('UserNotAuthorized', 401));
    }
  }
);

export const patientAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies?.auth_token) {
      const foundToken: any = getUserRoll(req.cookies?.auth_token);
      if ((foundToken as string) === 'Patient') {
        next();
      } else {
        return next(new ErrorHandler(foundToken, 401));
      }
    } else {
      return next(new ErrorHandler('UserNotAuthorized', 401));
    }
  }
);
