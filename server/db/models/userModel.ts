import userModel from "./userModel";
import validator from "validator";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { Schema, model, connect, Types, ObjectId } from "mongoose";

dotenv.config();

const { ObjectId } = mongoose.Schema;

export interface UserSchema extends mongoose.Document {
  fname: string;
  lname: string;
  description: string;
  email: string;
  username: string;
  createUserName(): void;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  image: string;
  avatar: string;
  gender: string;
  nid: string;
  insuranceid: string;
  phone: string;
  mobile: string;
  address: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  role: string;
  department: string;
  verify: boolean;
  refresh_token: string[];
}

export interface UserList {
  fname: string;
  lname: string;
  description: string;
  email: string;
  username: string;
  image: string;
  avatar: string;
  gender: string;
  nid: string;
  insuranceid: string;
  phone: string;
  mobile: string;
  address: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  role: string;
  department: string;
  verify: boolean;
}

const userSchema = new Schema<UserSchema>(
  {
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
    description: {
      type: String,
      required: false,
      trim: true,
      text: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      text: true,
      validate: [validator.isEmail, "EmailFormatWrong"],
    },
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      text: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    image: {
      type: String,
      default: "public/images/user-default.png",
      require: false,
    },
    avatar: {
      type: String,
      default: "public/images/avatar-default.png",
      require: false,
    },
    gender: {
      type: String,
      enum: ["Not Known", "Male", "Female", "Indeterminate"],
      require: true,
      trim: true,
      text: true,
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
    birth_month: {
      type: Number,
      require: true,
      trim: true,
    },
    birth_day: {
      type: Number,
      require: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Doctor", "Patient"],
      require: false,
      default: "Patient",
    },
    department: {
      type: String,
      trim: true,
      require: false,
    },
    verify: {
      type: Boolean,
      require: true,
      default: false,
    },
    refresh_token: [String],
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.pre("save", async function (this: UserSchema, next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt: string = await bcrypt.genSalt(
      parseInt(process.env.SALTLENGHT as string)
    );
    user.password = await bcrypt.hash(user.password, salt);
    await user.createUserName();
    return next();
  } catch (err: any) {
    return next(err);
  }
});

// Generate new username when the username exist in DB
userSchema.methods.createUserName = async function () {
  const user = this as UserSchema;
  let newuser: any;
  do {
    newuser = await userModel.findOne({ username: user.username });
    if (newuser) user.username += Math.floor(Math.random() * 3214).toString();
  } while (newuser);
};

// Compare a candidate password with the user's password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // So we don't have to pass this into the interface method
  const user = this as UserSchema;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

// Create access token
userSchema.methods.generateJWTAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN as string, {
    expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRE_LONG as string,
  });
};

// Create refresh token
userSchema.methods.generateJWTRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN as string, {
    expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRE_LONG as string,
  });
};

const Users = model<UserSchema>("users", userSchema);

export default Users;
