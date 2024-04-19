import validator from 'validator';
import dotenv from 'dotenv';
import mongoose, { Schema, model, connect, Types, ObjectId } from 'mongoose';

dotenv.config();

const { ObjectId } = mongoose.Schema;

export interface MessageSchema extends mongoose.Document {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  title: string;
  message: string;
}

const messageSchema = new Schema<MessageSchema>(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, 'FirstNameAtLeast3Characters'],
    },
    lname: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, 'LastNameAtLeast3Characters'],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      text: true,
      validate: [validator.isEmail, 'EmailFormatWrong'],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [10, 'PhoneNumberAtLeast10'],
      maxlength: [11, 'PhoneNumberMax11'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, 'MessageTitleAtLeast3Characters'],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [20, 'MessageAtLeast3Characters'],
      maxlength: [600, 'MessageMax600Characters'],
    },
  },
  { timestamps: true }
);

const Messages = model<MessageSchema>('messages', messageSchema);

export default Messages;
