import { Server } from 'socket.io';
import http from 'http';
import {verify as jwtVerify} from 'jsonwebtoken';
import {Iuser} from "../Interfaces/user.interface";
import { messageModel } from '../Models/message.model';
import {rateLimiter} from "../Utils/rateLimit.utils";


// Object to map user IDs to Socket.id
const connectedClients = {}; 

// Map to store online users per room
const onlineUsersPerRoom: Map<string, Set<string>> = new Map();

let io: Server;

export function initializeSocketIO(server: http.Server){
    io = new Server(server, {
      cors: {
        origin: '*', //'urls'
        methods: '*',
      },
        // Socket.io configuration options go here
        // Note:-
        // path: '' -> important in https need certificate path to work 
    });

    // Add authenticated Middelware.
    io.use( async (socket, next)=>{
        try{
            const token = socket.handshake.headers.authorization;
            if (!token) {
                next(new Error('In-valid Token'));
            };
            const decoded = await jwtVerify(token , process.env.TOKEN_SIGNATURE) as Iuser;
            // Add user Info in Socket instance                          
            socket.user = {userId: decoded.userId, userName: decoded.userName, auth: true}

            next();

        } catch(error){
            if (error?.message == "jwt expired") {
                next(new Error('Please Login again'));
            }else{
                next(new Error('Catch Error From Auth Middleware'));
            }
        }
    })


    io.on('connection', (socket)=>{
        // Associate the socket with a client ID
        connectedClients[socket.user.userId] = socket.id;

        
        // Join to the specified room 
        socket.on('joinRoom', (room: string) => {
            // Check if user already in this room
            if(!socket.rooms.has(room)){               
                socket.join(room);

                // add this user to online User list that in this room.
                if (!onlineUsersPerRoom.has(room)) {
                    onlineUsersPerRoom.set(room, new Set());
                };
                const roomOnlineUsers = onlineUsersPerRoom.get(room)!;
                roomOnlineUsers.add(socket.user.userName);

                // update online user
                updateOnlineUsers(room, roomOnlineUsers);
                
                const socketId = connectedClients[socket.user.userId]; 
                io.to(socketId).emit('joinRoom', `User: ${socket.user.userName} joined room: ${room}`);
            }else{
                const socketId = connectedClients[socket.user.userId];
                io.to(socketId).emit('joinRoom', `User: ${socket.user.userName} already joined in this room: ${room}`);
            }
        });

        // Send and receive messages in the chat rooms.
        
        socket.on('chatMessage', async(message: string, room: string)=>{

            // check if user is member in this room or not.
            if(socket.rooms.has(room)) {
                // Check message rate limit per room for user 
                if(rateLimiter.checkRateLimit(room, socket.user.userName)){

                    io.to(room).emit('chat message', `${socket.user.userName}: \n ${message}`);
                    const newMessage = new messageModel({
                        senderId: socket.user.userId,
                        senderUsername: socket.user.userName,
                        content: message,
                        room
                    });
                    await newMessage.save();

                }else{
                    const socketId = connectedClients[socket.user.userId];
                    io.to(socketId).emit('chat message', `Try later... this User ${socket.user.userName} exceeded Rate limit to send message in this Room: ${room}.`)
                }
            }else{
                const socketId = connectedClients[socket.user.userId];
                io.to(socketId).emit('chat message', 'Oops..You are not a member of this room.')
            }
        })

        // Handel disconnect user
        socket.on('disconnect', () => {
            
            //delete this user from online User list that in the rooms that his subscripe it
            const rooms = Array.from(socket.rooms);

            rooms.forEach((room) => {
                if (onlineUsersPerRoom.has(room)) {
                  const roomUsers = onlineUsersPerRoom.get(room)!;
                  // Remove the user from the room
                  roomUsers.delete(socket.user.userName); 

                  // Update the number of users in the room
                  updateOnlineUsers(room, roomUsers);
                }
            });

            // Remove the socket association on disconnect
            const userIdToRemove = Object.keys(connectedClients).find(
                (key) => connectedClients[key] === socket.id
            );

            if (userIdToRemove) {
                delete connectedClients[userIdToRemove];
            };
        });
        
    })

    return io;
};

function updateOnlineUsers(room: string, users: Set<string>) {
    const roomSockets = io.sockets.adapter.rooms.get(room);
    
    if (roomSockets) {
      io.to(room).emit('onlineUsers', Array.from(users));
    }
}