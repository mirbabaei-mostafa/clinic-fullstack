import express, { Router } from 'express';
import { getDoctors } from '../db/controllers/peoplesControllers';
import { getAccountDetail } from '../db/controllers/peoplesControllers';

const peopleRouter: Router = express.Router();

peopleRouter.get('/doctors', getDoctors);
peopleRouter.post('/details', getAccountDetail);

export default peopleRouter;
