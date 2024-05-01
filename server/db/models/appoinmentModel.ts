import mongoose, { Schema, model, ObjectId } from "mongoose";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();
const { ObjectId } = mongoose.Schema;

export interface AppoinmentSchema extends mongoose.Document {
  doctorId: ObjectId;
  patientId: ObjectId;
  department: ObjectId;
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

const appoinmentSchema = new Schema<AppoinmentSchema>(
  {
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
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      text: true,
      validate: [validator.isEmail, "EmailFormatWrong"],
    },
    gender: {
      type: String,
      enum: ["Not Known", "Male", "Female", "Indeterminate"],
      require: true,
      trim: true,
      text: true,
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
    phone: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [10, "PhoneNumberAtLeast10"],
      maxlength: [11, "PhoneNumberMax11"],
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [10, "PhoneNumberAtLeast10"],
      maxlength: [11, "PhoneNumberMax11"],
    },
    address: {
      type: String,
      required: false,
      trim: true,
      text: true,
      minlength: [10, "AddressAtLeast10"],
      maxlength: [300, "AddressMax300"],
    },
    birth_year: {
      type: Number,
      require: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Appoinments = model<AppoinmentSchema>("appoinment", appoinmentSchema);

export default Appoinments;
