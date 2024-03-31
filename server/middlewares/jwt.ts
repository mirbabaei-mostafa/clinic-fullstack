import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// For typescript, when developer needs to extend Request
// At first must to create an interface, that extends Requst
// then uses this interface with Requst in function entrance
export interface userRequest extends Request {
  userId: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    userId: string;
  }
}

const JWTVerification = async (
  // because we want to extend req
  // req: Request & userRequest,
  req: Request,
  // req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticationToken: any =
    req.headers.authorization || req.headers.Authorization;

  // Control token is not empty
  if (!authenticationToken?.toString().startsWith('Bearer ')) {
    return res.status(401).json({ message: 'TokenNotFound' });
  }

  const token: string = authenticationToken?.toString().split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN as string);
    req.userId = (decoded as any).id;
    return next();
  } catch (err) {
    res.status(401).json({ error: err, message: 'TokenVerificationFailed' });
    return next();
  }
};

export default JWTVerification;
