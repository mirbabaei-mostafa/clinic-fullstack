import express, { Router } from 'express';
import messageValidator from '../validators/messageValidator';
import {
  createMessage,
  getAllMessage,
  saveMessage,
} from '../db/controllers/messageController';
import { adminAuthenticated } from '../middlewares/authenticationCheck';

const messageRouter: Router = express.Router();

messageRouter.post('/save', messageValidator, saveMessage);
messageRouter.post('/create', messageValidator, createMessage);
messageRouter.get('/all', adminAuthenticated, getAllMessage);

export default messageRouter;
