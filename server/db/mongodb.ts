import mongoose from 'mongoose';
import dotenv from 'dotenv';

//For env File
dotenv.config();

export const connectDB = async () => {
  await mongoose
    .connect(
      process.env.MONGOINFOLOCAL as string
      // , { dbName: 'clinic-cordinate', }
    )
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((e) => {
      console.log(e.message);
    });
};
