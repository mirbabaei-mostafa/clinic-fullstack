import express, { Router } from 'express';
import messageValidator from '../validators/messageValidator';
import JWTVerification from '../middlewares/jwt';
import {
  createMessage,
  saveMessage,
} from '../db/controllers/messageController';

const messageRouter: Router = express.Router();

messageRouter.post('/save', messageValidator, saveMessage);
messageRouter.post('/create', messageValidator, createMessage);

export default messageRouter;
