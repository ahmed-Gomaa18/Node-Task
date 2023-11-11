import { Request, Response, NextFunction } from "express";
import {verify as jwtVerify} from 'jsonwebtoken';
import {Iuser} from "../Interfaces/user.interface"

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    try{    
        let token;
        const headerToken = req.headers['authorization'];
    
        if (!headerToken || !headerToken.startsWith('Bearer')) {
            return res.status(401).json({message:"In-valid Header Token"});
        };
    
        token = headerToken.split(" ")[1];
    
        if (!token || token.length < 1 ) {
            return res.status(401).json({message:"In-valid Token"});
        };
    
        const decoded = await jwtVerify(token , process.env.TOKEN_SIGNATURE) as Iuser;
    
        // Add user Info in Request                          
        req.user = {userId: decoded.userId, userName: decoded.userName, auth: true}
        return next();
    }catch (error) {
        
        if (error?.message == "jwt expired") {
          res.status(400).json({message:"Please Login again"})
        }else{
            res.status(400).json({message:"Catch Error From Auth Middleware " , error});
        }
    }


}