import { NextFunction, Request, Response } from 'express';

class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || 'Internal server error!';
  err.statusCode = 500;

  if (err.name === 'JWTError') {
    err = new ErrorHandler('JsonWebTokenIsInvalid', 400);
  }
  if (err.name === 'TokenExpire') {
    err = new ErrorHandler('JsonWebTokenExpired', 400);
  }

  return res
    .status(err.statusCode)
    .json({ success: false, message: err.message });
};

export default ErrorHandler;
