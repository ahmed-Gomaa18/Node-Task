import { messageModel } from "../Models/message.model";
import {rateLimiter} from "../Utils/rateLimit.utils";

export async function sendMessageService(senderId, senderUsername, content, room){
    // Check rate limiting per user
    if(!rateLimiter.checkRateLimit(room, senderUsername)){
        return{
            isSuccess: false,
            message: `Try later... this User ${senderUsername} exceeded Rate limit to send message in this Room: ${room}.`,
            status: 400,
        }
    }
    const newMessage = new messageModel({
        senderId, 
        senderUsername, 
        content, 
        room
    });
    const data = await newMessage.save();
    return{
        isSuccess: true,
        message: `${senderUsername} send message successfully.`,
        data,
        status: 201,
    }
}

export async function getAllChatMessagesService(roomName){

    const data = await messageModel.find({room: roomName});
    return{
        isSuccess: true,
        message: `Get all chat messages in this room ${roomName}.`,
        data,
        status: 201,
    }
}