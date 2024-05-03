import express, { Router } from 'express';
import upload from '../middlewares/multer';
import departmentValidator from '../validators/departmentValidator';
import {
  createDepatment,
  deleteDepatment,
  getAllDepartments,
  updateDepatment,
} from '../db/controllers/departmentController';

const departmentRouter: Router = express.Router();

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }]);

departmentRouter.post('/add', cpUpload, departmentValidator, createDepatment);
departmentRouter.get('/all', getAllDepartments);
departmentRouter.post(
  '/update',
  cpUpload,
  departmentValidator,
  updateDepatment
);
departmentRouter.get('/delete', deleteDepatment);

export default departmentRouter;
