import { NextFunction, Request, Response } from 'express';
import messageModel, { MessageSchema } from '../models/messageModel';
import {
  Result,
  ValidationError,
  cookie,
  validationResult,
} from 'express-validator';
import dotenv from 'dotenv';
import catchAsyncError from '../../middlewares/catchAsyncError';
import ErrorHandler from '../../middlewares/errorHandler';

dotenv.config();

// Save new Message
// If request was not valid, will return Error
export const saveMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    // Request is not valid
    return res.status(400).json({
      error: validateRes
        .array()
        .map((item) => item.msg)
        .join('|'),
    });
  } else {
    try {
      // Save new message
      const newMessage = await new messageModel({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        title: req.body.title,
        message: req.body.message,
      });
      await newMessage.save();
      // // OR
      // const createMessage = await messageModel.create({
      //   fname: req.body.fname,
      //   lname: req.body.lname,
      //   email: req.body.email,
      //   phone: req.body.phone,
      //   title: req.body.title,
      //   message: req.body.message,
      // });

      // Successfull save message
      return res
        .status(201)
        .json({ success: true, message: 'SuccessSendMessage' });
    } catch (err) {
      // Save Message
      // res.status(500).json({ error: validateRes.array() });
      return next(err);
    }
  }
};

export const createMessage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validateRes: Result<ValidationError> = validationResult(req);
    if (!validateRes.isEmpty()) {
      // Request is not valid
      // return res.status(400).json({ error: validateRes.array() });
      return next(
        new ErrorHandler(
          validateRes
            .array()
            .map((error) => error.msg)
            .join('|'),
          400
        )
      );
    } else {
      const createMessage = await messageModel.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        title: req.body.title,
        message: req.body.message,
      });

      // Successfull save message
      return res
        .status(201)
        .json({ success: true, message: 'SuccessSendMessage' });
    }
  }
);
