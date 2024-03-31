import express, { Request, Response, Application, NextFunction } from 'express';
import dotenv, { config } from 'dotenv';
import { connectDB } from './db/mongodb';
import mongoose from 'mongoose';
import { corsOptions, credentialCors } from './utils/corsconfig';
import cors, { CorsOptions } from 'cors';
import fileUpload from 'express-fileupload';
import JWTVerification from './middlewares/jwt';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import messageRouter from './routes/messageRouter';

const app: Application = express();

// config({ path: './config/config.env' });
// or
dotenv.config();
const port: string = process.env.PORT || '8000';

connectDB();

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});

app.use(credentialCors);
app.use(cors(corsOptions as CorsOptions));
// app.options("*", cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_API_Key,
  api_secret: process.env.Cloudinary_API_Secret,
});

app.use('/message', messageRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  const errStatus: number = err.status || 500;
  const errMessage: string = err.message || 'InternalServerError';
  return res
    .status(errStatus)
    .send({ success: false, message: errMessage, status: errStatus });
});
