import mongoose, { Schema, model, ObjectId } from 'mongoose';
import validator from 'validator';
import dotenv from 'dotenv';

dotenv.config();
const { ObjectId } = mongoose.Schema;

export interface TimelineSchema extends mongoose.Document {
  onSiteId: ObjectId;
  doctorId: ObjectId;
  patientId: ObjectId;
  userId: ObjectId;
  departmentId: ObjectId;
  date: string;
  time: string;
  status: string;
}

const timelineSchema = new Schema<TimelineSchema>(
  {
    onSiteId: {
      type: ObjectId,
      required: true,
      ref: 'onsite',
    },
    doctorId: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    patientId: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'users',
    },
    departmentId: {
      type: ObjectId,
      required: true,
      ref: 'departments',
    },
    date: {
      type: String,
      required: true,
      text: true,
      minlength: [10, 'OnSiteDateMustBe10Characters'],
      maxlength: [10, 'OnSiteDateMustBe10Characters'],
    },
    time: {
      type: String,
      required: true,
      text: true,
      minlength: [10, 'OnSiteStartTimeMustBe10Characters'],
      maxlength: [10, 'OnSiteStartTimeMustBe10Characters'],
    },
    status: {
      type: String,
      enum: ['Unassigned', 'Assigned', 'Canceled'],
      require: true,
      default: 'Unassigned',
      text: true,
    },
  },
  { timestamps: true }
);

const Timelines = model<TimelineSchema>('timelines', timelineSchema);

export default Timelines;
