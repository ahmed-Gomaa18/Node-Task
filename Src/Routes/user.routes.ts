import { Router } from "express";
import {Register, getAllUsers} from "../Controllers/user.controller";

export const userRouter = Router();

userRouter.post('/', Register);
userRouter.get('/', getAllUsers);