import userModel, { UserSchema } from '../db/models/userModel';
// import jwt from 'jsonwebtoken';

export const getUserId = async (token: string) => {
  try {
    const foundUser: UserSchema | null = await userModel.findOne({
      refresh_token: token,
    });

    // send user role
    return foundUser?._id as string;
  } catch (err: any) {
    return err.message as string;
  }
};
