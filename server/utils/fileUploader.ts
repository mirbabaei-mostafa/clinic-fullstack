import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../middlewares/errorHandler';
import multer from "multer"

const AllowFormats = {
  "image": ['/image/png', '/image/jpeg', '/image/gif', '/image/webp'],
};

const fileUploader = (
  req: Request,
  res: Response,
  next: NextFunction,
  allowFormat: string
) => {
  const uploader = multer({ dest: 'uploads/' })
  const { uploadedFiles } = req.files;
  if(allowFormat === "image") {
    if(!AllowFormats.image.includes(uploadedFiles.mimetype) {
        return next(new ErrorHandler('FileTypeMustBeImage', 401));
    })
  }
};
