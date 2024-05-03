import mongoose, { Schema, model, connect, Types, ObjectId } from 'mongoose';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();

const { ObjectId } = mongoose.Schema;

export interface OnSiteSchema extends mongoose.Document {
  doctorId: ObjectId;
  departmentId: ObjectId;
  date: string;
  starttime: string;
  endtime: string;
  step: number;
  isactive: boolean;
}

const onSiteSchema = new Schema<OnSiteSchema>(
  {
    doctorId: {
      type: ObjectId,
      required: true,
      text: true,
    },
    departmentId: {
      type: ObjectId,
      required: true,
      text: true,
    },
    date: {
      type: String,
      required: true,
      text: true,
      minlength: [10, 'OnSiteDateMustBe10Characters'],
      maxlength: [10, 'OnSiteDateMustBe10Characters'],
    },
    starttime: {
      type: String,
      required: true,
      text: true,
      minlength: [5, 'OnSiteStartTimeMustBe10Characters'],
      maxlength: [5, 'OnSiteStartTimeMustBe10Characters'],
    },
    endtime: {
      type: String,
      required: true,
      text: true,
      minlength: [5, 'OnSiteEndTimeMustBe10Characters'],
      maxlength: [5, 'OnSiteEndTimeMustBe10Characters'],
    },
    step: {
      type: Number,
      required: true,
      min: [5, 'StepAppoinmentAtLeast5Minutes'],
      max: [120, 'StepAppoinmentAtLeast120Minutes'],
    },
    isactive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const OnSites = model<OnSiteSchema>('onsite', onSiteSchema);

export default OnSites;
