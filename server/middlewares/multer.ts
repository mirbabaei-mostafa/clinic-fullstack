import { Request } from "express";
import multer from "multer";
import randomstring from "randomstring";

const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(
      null,
      randomstring.generate({ length: 32, charset: "alphanumeric" }) +
        file.originalname
    );
  },
});

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880, // maxSize / bytes
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }

    cb(null, true);
  },
});

export default upload;
