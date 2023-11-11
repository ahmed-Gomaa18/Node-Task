import {Iuser} from "../Src/Interfaces/user.interface";

declare module 'express-serve-static-core'{
    export interface Request {
        user: Iuser,
    }
}

declare module 'socket.io' {
    interface Socket {
        user: Iuser,
    }
}