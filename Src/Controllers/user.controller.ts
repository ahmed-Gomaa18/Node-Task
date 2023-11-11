import {Request, Response} from "express";

import {registerService, getAllUsersService} from "../Services/user.service"

export async function Register(req: Request, res: Response) {
    try{
        const {userName, email, password} = req.body;
        const result = await registerService(userName, email, password);
        if(!result.isSuccess){
            return res.status(result.status).json({message: result.message});
        }

        return res.status(result.status).json({message: result.message, data: result.data});

    }catch(error){
        return res.status(400).json(error.message);
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try{
        const result = await getAllUsersService();
        return res.status(result.status).json({message: result.message, data: result.data});

    }catch(error){
        return res.status(400).json(error.message);
    }
}
