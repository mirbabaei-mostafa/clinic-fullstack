import express, { Router } from 'express';
import messageValidator from '../validators/messageValidator';
import JWTVerification from '../middlewares/jwt';
import { saveMessage } from '../db/controllers/messageController';

const messageRouter: Router = express.Router();

messageRouter.post('/save', messageValidator, saveMessage);

export default messageRouter;
