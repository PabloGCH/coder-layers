import express, { Request, Response, Router } from "express";
import os from "os";
import {fork} from "child_process";
import { siteRouter } from "./site.router";
import { numbersRouter } from "./numbers.router";
import { infoRouter } from "./info.router";
import { authRouter } from "./auth.router";
import { productsRouter } from "./products.router";
import { messagesRouter } from "./messages.router";
import { warningLogger } from "../services/logger.service";



export class RouterManager{
    private router :Router = express.Router();
    constructor(
        private io :any //SocketServer
    ) {
        this.loadRoutes();
    }
    public getRouter() :Router {
        return this.router;
    }
    private loadRoutes() :void {
        this.router.use("/site", siteRouter);
        this.router.use("/api/numbers", numbersRouter);
        this.router.use("/api/info", infoRouter);
        this.router.use("/api/auth", authRouter);
        this.router.use("/api/products", productsRouter);
        this.router.use("/api/messages", messagesRouter);
        this.router.get("/", (req :any, res :any) => {
            res.redirect("/site")
        });
        this.router.get("*", (req :Request, res :Response) => {
            warningLogger.warn({
                message: "Route not found",
                url: req.url,
                method: req.method
            })
            res.sendStatus(404);
        });
    }
}


