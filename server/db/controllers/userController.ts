import { NextFunction, Request, Response } from "express";
import userModel, { UserSchema } from "../models/userModel";
import resetPasswordModel, {
  ResetPasswordSchema,
} from "../models/resetPasswordModel";
import {
  Result,
  ValidationError,
  cookie,
  validationResult,
} from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendVerification, {
  sendResetPasswordCodeByEmail,
} from "../../utils/mailer";
import randomstring from "randomstring";
import ErrorHandler from "../../middlewares/errorHandler";
import { file } from "googleapis/build/src/apis/file";

dotenv.config();

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

// Register new User
// If request was not valid, will return Error
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    // Request in snot valid
    // return res.status(400).json({
    //   error: validateRes
    //     .array()
    //     .map((item) => item.msg)
    //     .join('|'),
    // });
    // OR
    return next(
      new ErrorHandler(
        validateRes
          .array()
          .map((item) => item.msg)
          .join("|"),
        400
      )
    );
  } else {
    try {
      const files: any = req.files;
      // Iterate over each file and access its path
      // Object.keys(files).forEach((fieldname: string) => {
      //   const fileArray: UploadedFile[] = files[fieldname];
      //   fileArray.forEach((file: UploadedFile) => {
      //     const filePath: string = file.path;
      //     console.log(`File path for ${file.originalname}: ${filePath}`);
      //     // Do whatever you want with the file path
      //   });
      // });

      // Save new user
      // In userModel passwrd will be encrypted and username will be created
      const userData = {
        ...req.body,
        username: (req.body.fname + req.body.lname).toString().toLowerCase(),
      };
      console.log(files);
      if (files) {
        console.log(userData);
        if (files["image"][0]?.path) {
          userData["image"] = files["image"][0]?.path;
        }
        //   if (files["avatar"][0]?.path) {
        //     userData["avatar"] = files["avatar"][0]?.path;
        //   }
      }
      console.log(userData);

      const newUser = await new userModel(userData);
      await newUser.save();

      // Send verification email
      const mailToken = jwt.sign(
        { id: newUser.id.toString() },
        process.env.JWT_TOKEN as string,
        { expiresIn: "30m" }
      );
      const url: string = process.env.BASEURL + "/activate/" + mailToken;
      await sendVerification(newUser.email, newUser.username, url);

      // Successfull create new user
      return res.status(201).json({ message: "SuccessRegisterUser" });
    } catch (err: any) {
      // Registring new user faced an error and return Error
      // res.status(500).json({ error: validateRes.array() });
      return next(new ErrorHandler(err.message || "InternalServerError", 500));
    }
  }
};

// Verify user after registration with email verification
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;

  // To control if the token exist
  if (!token) {
    // return res.status(401).json({ message: 'TokenNotValidated' });
    // OR
    return next(new ErrorHandler("TokenNotValidated", 400));
  }

  try {
    // Compare recieved token with secret key
    const userId = jwt.verify(token, process.env.JWT_TOKEN as string);
    if (!userId) {
      //   return res.status(401).json({ message: 'TokenNotVerifiedOrExpired' });
      // OR
      return next(new ErrorHandler("TokenNotVerifiedOrExpired", 401));
    }

    const foundUser = await userModel.findById((userId as any).id);
    if (!foundUser) {
      //   return res.status(401).json({ message: 'TokenNotAssignToUser' });
      // OR
      return next(new ErrorHandler("TokenNotAssignToUser", 401));
    }

    // to prevent access when user try to access with another access token
    if (foundUser.id !== req.userId)
      //   return res.status(403).json({ message: 'TokenNotValidated' });
      // OR
      return next(new ErrorHandler("TokenNotValidated", 403));

    if (foundUser!.verify) {
      return res.status(200).json({ message: "UserWasAlreadyVerified" });
    } else {
      // foundUser!.verify = true;
      // await foundUser?.save();
      await userModel.findByIdAndUpdate((userId as any).id, { verify: true });
      return res.status(200).json({ message: "UserActivated" });
    }
  } catch (err: any) {
    // return res.status(401).json({ message: err });
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// Resend verification E-Mail
export const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.userId) {
    try {
      const foundUser = await userModel.findById(req.userId);
      if (!foundUser) {
        // return res.status(401).json({ message: 'UserNotFound' });
        // OR
        return next(new ErrorHandler("UserNotFound", 401));
      }

      if (foundUser.verify === true) {
        // return res.status(400).json({ message: 'UserVerified' });
        // OR
        return next(new ErrorHandler("UserVerified", 400));
      }

      // Send verification email
      const mailToken = jwt.sign(
        { id: foundUser.id.toString() },
        process.env.JWT_TOKEN as string,
        { expiresIn: "30m" }
      );
      const url: string = process.env.BASEURL + "/activate/" + mailToken;
      await sendVerification(foundUser.email, foundUser.username, url);

      // Successfull create new user
      return res.status(201).json({ message: "VerificationEmailsended" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message || "InternalServerError", 500));
    }
  }
};

// User authentication
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // User entry validation
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    // Request in snot valid
    // res.status(400).json({ error: validateRes.array() });
    // OR
    return next(
      new ErrorHandler(
        validateRes
          .array()
          .map((item) => item.msg)
          .join("|"),
        401
      )
    );
  } else {
    try {
      // Find when the email address exist
      const foundUser = await userModel.findOne<UserSchema | undefined>({
        email: req.body.email,
      });
      // Email address dose not exit
      if (!foundUser) {
        // return res.status(401).json({ error: 'EmailDoseNotExist' });
        // OR
        return next(new ErrorHandler("EmailDoseNotExist", 401));
      }
      // Password entered wrong
      const compareRes = await foundUser.comparePassword(req.body.password);
      if (!compareRes) {
        // return res.status(401).json({ error: 'PasswordIsWrong' });
        // OR
        return next(new ErrorHandler("PasswordIsWrong", 401));
      }

      // Create access and refresh tokens
      const [accessToken, refreshToken] = tokenCreator(foundUser._id);

      // To control, when a token expired then remove from token array
      // Notice: refresh token is array becouse to cover all devices at the same time
      let refreshTokenArray: string[] = req.cookies?.auth_token
        ? foundUser.refresh_token.filter(
            (t: string) => t !== req.cookies.auth_token
          )
        : foundUser.refresh_token;

      // find user from it's refresh token when it exist
      if (req.cookies?.auth_token) {
        const foundToken = await userModel.findOne({
          refreshToken: req.cookies.auth_token,
        });
        if (!foundToken) refreshTokenArray = [];

        res.clearCookie("auth_token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      }

      // adding new refresh token to refresh token array and save to DB
      foundUser.refresh_token = [...refreshTokenArray, refreshToken];
      await foundUser.save();

      // send new refresh token as cookie to client
      res.cookie("auth_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge:
          parseInt(process.env.COOKIE_CLIENT_MAXAGE as string) *
          1000 *
          60 *
          60 *
          24,
      });
      // send authenticated user information to client
      res.json({
        accessToken: accessToken,
        fname: foundUser.fname,
        lname: foundUser.lname,
        email: foundUser.email,
        username: foundUser.username,
        image: foundUser.image,
        avatar: foundUser.avatar,
        phone: foundUser.phone,
        mobile: foundUser.mobile,
        role: foundUser.role,
        department: foundUser.department,
        verify: foundUser.verify,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message || "InternalServerError", 500));
    }
  }
};

export const signOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies?.auth_token) return res.sendStatus(204);
  const oldToken: any = req.cookies?.auth_token;

  const foundUser: UserSchema | null = await userModel.findOne({
    refresh_token: oldToken,
  });

  // Remove current access cookie
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now()),
  });

  if (!foundUser) {
    return res.sendStatus(204);
  }

  // Remove old refresh token from refresh token array
  foundUser.refresh_token = foundUser.refresh_token.filter(
    (rToken) => rToken !== oldToken
  );
  // await foundUser.updateOne();
  await foundUser.save();
  return res.sendStatus(204);
};

// Renew user refresh token
// Token with evry Request send to server
// cookieParser get the cookie and store it in
export const renewToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies?.auth_token) return res.sendStatus(401);
  const oldToken: any = req.cookies?.auth_token;

  // Remove current access cookie
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  try {
    const foundUser: UserSchema | null = await userModel.findOne({
      refresh_token: oldToken,
    });

    jwt.verify(
      oldToken,
      process.env.JWT_REFRESH_TOKEN as string,
      async (err: any, decoded: any) => {
        // If refresh token exist but user dose not exist
        // maybe app/website hacked then have to remove refresh token
        if (!foundUser) {
          if (err) return;

          const hackedUser: any = await userModel.findOne({
            _id: (decoded as any).id,
          });
          if (hackedUser) {
            hackedUser.refresh_token = [];
            await hackedUser.updateOne();
          }
          // return res.sendStatus(403).json({ message: 'Forbiden' });
          // OR
          return next(new ErrorHandler("Forbiden", 401));
        }

        // Remove old refresh token from refresh token array
        const newRefreshTokenArr = foundUser.refresh_token.filter(
          (rToken) => rToken !== oldToken
        );

        // When occured an error, means that token is not verfied.
        // save token array and back forbiden error
        if (err) {
          foundUser.refresh_token = [...newRefreshTokenArr];
          await foundUser.save();
          //   return res.sendStatus(403);
          // OR
          return next(new ErrorHandler("Forbiden", 403));
        }

        // When occured an error and found user is diffrent with
        if (foundUser._id.toString() !== decoded.id.toString()) {
          //   return res.sendStatus(403);
          // OR
          return next(new ErrorHandler("UserIsDiffrent", 403));
        }

        // Create new access and refresh tokens
        const [accessToken, refreshToken] = tokenCreator(foundUser._id);
        foundUser.refresh_token = [...newRefreshTokenArr, refreshToken];
        // await foundUser.updateOne();
        await foundUser.save();

        // send new refresh token as cookie to client
        res.cookie("auth_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge:
            parseInt(process.env.COOKIE_CLIENT_MAXAGE as string) *
            1000 *
            60 *
            60 *
            24,
        });

        // // send to client
        // res.json({
        //   accessToken: accessToken,
        // });

        // send user access token and information to client
        return res.json({
          accessToken: accessToken,
          fname: foundUser.fname,
          lname: foundUser.lname,
          email: foundUser.email,
          username: foundUser.username,
          image: foundUser.image,
          avatar: foundUser.avatar,
          phone: foundUser.phone,
          mobile: foundUser.mobile,
          role: foundUser.role,
          department: foundUser.department,
          verify: foundUser.verify,
        });
      }
    );
  } catch (err: any) {
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// Create refresh and access token
const tokenCreator = (id: string): string[] => {
  // Create new access and refresh tokens
  const accessToken: string = jwt.sign(
    { id },
    process.env.JWT_ACCESS_TOKEN as string,
    { expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRE_LONG as string }
  );
  const refreshToken: string = jwt.sign(
    { id },
    process.env.JWT_REFRESH_TOKEN as string,
    { expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRE_LONG as string }
  );
  return [accessToken, refreshToken];
};

export const findAccountByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    // Request in snot valid
    // return res.status(400).json({ error: validateRes.array() });
    // OR
    return next(
      new ErrorHandler(
        validateRes
          .array()
          .map((item) => item.msg)
          .join("|"),
        400
      )
    );
  } else {
    try {
      // Find when the email address exist
      const foundUser = await userModel.findOne<UserSchema | undefined>({
        email: req.body.email,
      });
      // Email address dose not exit
      if (!foundUser) {
        // return res.status(401).json({ error: 'EmailDoseNotExist' });
        // OR
        return next(new ErrorHandler("EmailDoseNotExist", 401));
      }
      // send authenticated user information to client
      return res.json({
        email: foundUser.email,
        image: foundUser.image,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message || "InternalServerError", 500));
    }
  }
};

// Send reset password code to user email address
export const sendResetPasswordCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    // return res.status(401).json({ error: 'InvalidEmail' });
    // OR
    return next(new ErrorHandler("InvalidEmail", 401));
  }
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: req.body.email,
    });
    // Email address dose not exit
    if (!foundUser) {
      //   return res.status(401).json({ error: 'EmailDoseNotExist' });
      // OR
      return next(new ErrorHandler("EmailDoseNotExist", 401));
    }

    // Remove old reset password code from codes model
    await resetPasswordModel.findOneAndDelete({ user: foundUser._id });

    // create new code
    const code = randomstring.generate({
      length: 6,
      charset: "alphabetic",
    });

    // create new code record in db
    const newCode = await new resetPasswordModel({
      code: code,
      user: foundUser._id,
    });

    await newCode.save();

    // send code by email
    await sendResetPasswordCodeByEmail(foundUser.email, foundUser.fname, code);

    // send successful message to client
    return res.status(200).json({
      message: "ResetCodeSended",
    });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// verify code for reset password
export const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    // return res.status(401).json({ error: 'InvalidEmail' });
    // OR
    return next(new ErrorHandler("InvalidEmail", 401));
  }
  if (!req.body.code) {
    // return res.status(401).json({ error: 'CodeIsEmpty' });
    // OR
    return next(new ErrorHandler("CodeIsEmpty", 401));
  }
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: req.body.email,
    });
    // Email address dose not exit
    if (!foundUser) {
      //   return res.status(401).json({ error: 'EmailDoseNotExist' });
      // OR
      return next(new ErrorHandler("EmailDoseNotExist", 401));
    }

    // Find code by user id
    const code = await resetPasswordModel.findOne({ user: foundUser._id });

    // The code that user enterd is match with the code in DB
    if (code?.code.toString() === req.body.code.toString()) {
      return res.status(200).json({
        code: code?.code,
      });
    }
    // The code that user enterd is not match with the code in DB
    else {
      return res.status(400).json({
        message: "CodeIsNotMatch",
      });
    }
  } catch (err: any) {
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// Reset password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    // return res.status(401).json({ error: 'InvalidEmail' });
    // OR
    return next(new ErrorHandler("InvalidEmail", 401));
  }
  if (!req.body.newpassword) {
    // return res.status(401).json({ error: 'PasswordIsEmpty' });
    // OR
    return next(new ErrorHandler("PasswordIsEmpty", 401));
  }
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: req.body.email,
    });
    // Email address dose not exit
    if (!foundUser) {
      //   return res.status(401).json({ error: 'EmailDoseNotExist' });
      // OR
      return next(new ErrorHandler("EmailDoseNotExist", 401));
    }

    // Save new password
    foundUser.password = req.body.newpassword;
    await foundUser.save();

    // Remove reset password code from codes model
    await resetPasswordModel.findOneAndDelete({ user: foundUser._id });

    // send successful message to client
    return res.status(200).json({
      message: "SuccessfullyResetPassword",
    });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// Cancel password reset
export const cancelResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    // return res.status(401).json({ error: 'InvalidEmail' });
    // OR
    return next(new ErrorHandler("InvalidEmail", 401));
  }
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: req.body.email,
    });
    // Email address dose not exit
    if (!foundUser) {
      //   return res.status(401).json({ error: 'EmailDoseNotExist' });
      // OR
      return next(new ErrorHandler("EmailDoseNotExist", 401));
    }

    // Remove old reset password code from codes model
    await resetPasswordModel.findOneAndDelete({ user: foundUser._id });

    // send successful message to client
    return res.status(200).json({
      message: "ResetCodeCanceled",
    });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || "InternalServerError", 500));
  }
};

// Get user role
const getRole = async (email: string) => {
  if (!email) {
    return "";
  }
  try {
    // Find when the email address exist
    const foundUser = await userModel.findOne<UserSchema | undefined>({
      email: email,
    });
    // Email address dose not exit
    if (!foundUser) {
      return "";
    }
    return foundUser.role;
  } catch (err: any) {
    return err.message;
  }
};
