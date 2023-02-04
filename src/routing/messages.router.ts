import express, {Request, Response} from "express";
import { Server } from "socket.io";
import { newMessage } from "../controllers/messages.controller";

export class MessageRouter {
    private router = express.Router();
    constructor(
        private io :Server
    ) {
        this.router.post("/message", newMessage(io));
    }
    getRouter() {
        return this.router;
    }
}


