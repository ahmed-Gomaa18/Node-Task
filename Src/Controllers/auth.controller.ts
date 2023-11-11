import {Request, Response} from "express";

import { loginService } from "../Services/auth.service";


export async function Login(req: Request, res: Response) {
    try{
        const {userName, password, rememberMe} = req.body;
        const result = await loginService(userName, password, rememberMe);
        if(!result.isSuccess){
            return res.status(result.status).json({message: result.message});
        }

        return res.status(result.status).json({message: result.message, data: result.data});

    }catch(error){
        return res.status(400).json(error.message);
    }
}