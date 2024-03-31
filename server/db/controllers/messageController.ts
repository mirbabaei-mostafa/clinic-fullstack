import { NextFunction, Request, Response } from 'express';
import messageModel, { MessageSchema } from '../models/messageModel';
import {
  Result,
  ValidationError,
  cookie,
  validationResult,
} from 'express-validator';
import dotenv from 'dotenv';

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
    return res.status(400).json({ error: validateRes.array() });
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

      //   // Send verification email
      //   const mailToken = jwt.sign(
      //     { id: newUser.id.toString() },
      //     process.env.JWT_TOKEN as string,
      //     { expiresIn: '30m' }
      //   );
      //   const url: string = process.env.BASEURL + '/activate/' + mailToken;
      //   await sendVerification(newUser.email, newUser.username, url);

      // Successfull save message
      return res.status(201).json({ message: 'SuccessSendMessage' });
    } catch (err) {
      // Save Message
      // res.status(500).json({ error: validateRes.array() });
      return next(err);
    }
  }
};
