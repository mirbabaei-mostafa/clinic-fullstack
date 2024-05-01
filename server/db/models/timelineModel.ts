import mongoose, { Schema, model, ObjectId } from "mongoose";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();
const { ObjectId } = mongoose.Schema;

export interface TimelineSchema extends mongoose.Document {
  onSiteId: ObjectId;
  doctorId: ObjectId;
  patientId: ObjectId;
  department: ObjectId;
  date: string;
  time: string;
  fname: string;
  lname: string;
  email: string;
  gender: string;
  nid: string;
  insuranceid: string;
  phone: string;
  mobile: string;
  address: string;
  birth_year: number;
  status: string;
}

const timelineSchema = new Schema<TimelineSchema>(
  {
    onSiteId: {
      type: ObjectId,
      required: true,
      ref: "onsite",
    },
    doctorId: {
      type: ObjectId,
      required: true,
      ref: "users",
    },
    patientId: {
      type: ObjectId,
      required: true,
      ref: "users",
    },
    department: {
      type: ObjectId,
      required: true,
      ref: "departments",
    },
    date: {
      type: String,
      required: true,
      text: true,
      minlength: [10, "OnSiteDateMustBe10Characters"],
      maxlength: [10, "OnSiteDateMustBe10Characters"],
    },
    time: {
      type: String,
      required: true,
      text: true,
      minlength: [10, "OnSiteStartTimeMustBe10Characters"],
      maxlength: [10, "OnSiteStartTimeMustBe10Characters"],
    },
    fname: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, "FirstNameAtLeast3Characters"],
    },
    lname: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, "LastNameAtLeast3Characters"],
    },
    nid: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [10, "NationalIdAtLeast10Characters"],
    },
    insuranceid: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [8, "InsuranceIdAtLeast8Characters"],
    },
    status: {
      type: String,
      enum: ["Unassigned", "Assigned", "Canceled"],
      require: true,
      default: "Unassigned",
      text: true,
    },
  },
  { timestamps: true }
);

const Timelines = model<TimelineSchema>("timelines", timelineSchema);

export default Timelines;
