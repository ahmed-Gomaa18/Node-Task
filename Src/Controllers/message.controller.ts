import {Request, Response} from "express";
import { sendMessageService, getAllChatMessagesService } from "../Services/message.service";




export async function sendMessage(req: Request, res: Response) {
    try{
        const {content, room} = req.body;
        const result = await sendMessageService(req.user.userId, req.user.userName, content, room);
        
        if(!result.isSuccess){
            return res.status(result.status).json({message: result.message});
        }

        return res.status(result.status).json({message: result.message, data: result.data});

    }catch(error){
        return res.status(400).json(error.message);
    }
}

export async function getAllChatMessages(req: Request, res: Response) {
    try{
        const roomName = req.params.roomName;
        const result = await getAllChatMessagesService(roomName);

        return res.status(result.status).json({message: result.message, data: result.data});

    }catch(error){
        return res.status(400).json(error.message);
    }
}