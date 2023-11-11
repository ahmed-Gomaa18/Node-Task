import { Router } from "express";
import {sendMessage, getAllChatMessages} from "../Controllers/message.controller"
import {authMiddleware} from "../Middlewares/auth.middleware";

export const messageRouter = Router();

messageRouter.post('/', authMiddleware, sendMessage);
messageRouter.get('/room/:roomName', authMiddleware, getAllChatMessages); 