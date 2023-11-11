import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from "http";
import express, {Request, Response}from "express";
import cors from "cors";
import mongoose from "mongoose";
import {initializeSocketIO} from './Config/socket.config';

const app = express();

app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers
import {userRouter} from "./Routes/user.routes";
import {authRouter} from "./Routes/auth.routes";
import {messageRouter} from "./Routes/message.routes";

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

app.get('/', (req, res)=>{
    return res.send('Success');
})

// For Unexcepted Error
// Handel UncaughtException Exception 
process.on("uncaughtException", (exception)=>{
    console.log(exception)
    console.log("Error From uncaughtException");
   
});

process.on("unhandledRejection", (exception)=>{
    console.log(exception)
    console.log("Promise Rejection");
});

// Handle non-existent endpoints
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'This Endpoint not found' });
});

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Database Connected....");
    const server = http.createServer(app);

    // Initialize Socket.io and pass the server instance
    initializeSocketIO(server);

    server.listen(process.env.PORT, () => {
      console.log("Server Running on http://localhost:" + process.env.PORT);
    });
}).catch((err: Error)=>{console.log(err)});