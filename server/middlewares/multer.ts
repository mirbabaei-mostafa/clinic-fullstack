import { Request } from 'express';
import multer from 'multer';
import randomstring from 'randomstring';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // cb(null, Date.now() + '-' + file.originalname);
    cb(
      null,
      randomstring.generate({ length: 32, charset: 'alphanumeric' }) +
        file.originalname
    );
  },
});

// Create the multer instance
const upload = multer({ storage: storage });

export default upload;
