import mongoose, { Schema, model } from "mongoose";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

export interface DepartmentSchema extends mongoose.Document {
  dname: string;
  description: string;
  phone: string;
  avatar: string;
}

const departmentSchema = new Schema<DepartmentSchema>(
  {
    dname: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [3, "FirstNameAtLeast3Characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [20, "DescriptionAtLeast3Characters"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      text: true,
      minlength: [10, "PhoneNumberAtLeast10"],
    },
    avatar: {
      type: String,
      default: "public/images/avatar-default.png",
      require: false,
    },
  },
  { timestamps: true }
);

const Departments = model<DepartmentSchema>("departments", departmentSchema);

export default Departments;
