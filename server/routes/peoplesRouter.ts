import express, { Router } from 'express';
import {
  getDoctors,
  getPatients,
  getUsers,
} from '../db/controllers/peoplesControllers';
import { getAccountDetail } from '../db/controllers/peoplesControllers';

const peopleRouter: Router = express.Router();

peopleRouter.get('/doctors', getDoctors);
peopleRouter.get('/users', getUsers);
peopleRouter.get('/patients', getPatients);
peopleRouter.post('/details', getAccountDetail);

export default peopleRouter;
