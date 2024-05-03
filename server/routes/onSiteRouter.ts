import express, { Router } from 'express';
import upload from '../middlewares/multer';
import onSiteValidator from '../validators/onSiteValidator';
import {
  activeOnsite,
  createOnSite,
  deleteOnSite,
  getAllOnSite,
  inactiveOnsite,
  updateOnSite,
} from '../db/controllers/onSiteController';

const onSiteRouter: Router = express.Router();

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }]);

onSiteRouter.post('/add', cpUpload, onSiteValidator, createOnSite);
onSiteRouter.get('/all', getAllOnSite);
onSiteRouter.post('/update', cpUpload, onSiteValidator, updateOnSite);
onSiteRouter.get('/delete', deleteOnSite);
onSiteRouter.get('/active', activeOnsite);
onSiteRouter.get('/inactive', inactiveOnsite);

export default onSiteRouter;
