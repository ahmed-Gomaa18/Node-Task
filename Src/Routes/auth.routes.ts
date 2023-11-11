import { Router } from "express";
import {Login} from "../Controllers/auth.controller";

export const authRouter = Router();

authRouter.post('/', Login);
