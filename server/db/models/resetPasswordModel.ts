import dotenv from 'dotenv';
import mongoose, { Schema, model, connect, Types, ObjectId } from 'mongoose';

const { ObjectId } = mongoose.Schema;

export interface ResetPasswordSchema extends mongoose.Document {
  code: string;
  user: ObjectId;
}

const resetPasswordSchema = new Schema<ResetPasswordSchema>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      text: true,
    },
    user: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
  },
  { timestamps: true }
);

const Codes = model<ResetPasswordSchema>('codes', resetPasswordSchema);

export default Codes;
