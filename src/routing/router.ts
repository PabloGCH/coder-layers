import express, { Request, Response, Router } from "express";
import { Socket, Server as SocketServer} from "socket.io";
import * as productDbManager from "../persistence/managers/productsDbManager";
import * as messageManager from "../persistence/managers/messageDbManager";
import os from "os";
import { UserModel } from "../persistence/schemas/user";
import {fork} from "child_process";
import passport from "passport";
import bcrypt from "bcrypt";
import compression from "compression";
import { siteRouter } from "./site.router";
import { numbersRouter } from "./numbers.router";


const NUMBEROFCORES = os.cpus().length;


export class RouterManager{
    private router :Router = express.Router();
    constructor(
        private io :any
    ) {
        this.loadRoutes();
    }
    public getRouter() :Router {
        return this.router;
    }
    private loadRoutes() :void {
        this.router.use("/site", siteRouter);
        this.router.use("/numbers", numbersRouter)
        this.router.get("/", (req :any, res :any) => {
            res.redirect("/site/")
        })
        /*

        this.router.get("/server-info", compression(), (req :any, res :any) => {
            if(process.send) {
                process.send(process.pid);
            }
            const serverData = {
                os: process.platform,
                vnode: process.versions.node,
                rrs: process.memoryUsage.rss(),
                pid: process.pid,
                args: process.argv.slice(2).toString(),
                execPath: process.execPath,
                projectPath: process.env.PWD,
                cores: NUMBEROFCORES
            }
            res.send(serverData);
        })




        this.router.post("/register", passport.authenticate("signupStrategy", {
            failureRedirect: "/register",
            failureMessage: true
        }), (req :any, res :any) => {
            res.send({success: req.success || false, message: req.message||""})
        });

        this.router.post("/login", (req:any, res :any) => {
            const body = req.body;
            if(req.session.user) {
                res.send({message:"already logged"})
            } else if(body.username && body.password) {
                UserModel.findOne({username: body.username}, (err:any, userFound:any) => {
                    if(err) {
                        res.send(err)
                    }
                    if(userFound) {
                        if(bcrypt.compareSync(body.password, userFound.password)) {
                            req.session.user = {
                                username: body.username,
                                password: body.password
                            }
                            res.send({success: true, message: "Session initialized"})
                        } else {
                            res.send({success: false, message: "Invalid password"})
                        }
                    }
                })

            } else {
                res.send({success: false, message: "Invalid user inputs"})
            }
        })

        this.router.post("/newMessage", (req :Request|any, res :Response) => {
            try {
                if(req.session.user == undefined){
                    errorLogger.error({
                        message: "User not logged in",
                        url: req.url,
                        method: req.method
                    })
                    res.send({success: false, message: "not_logged"})
                } else {
                    messageManager.save(req.body).then(() => {
                        messageManager.getAll().then(messages => {
                            this.io.sockets.emit("messages", {messages: messages})
                            res.send({success: true})
                        })
                    }).catch((err) => {
                        errorLogger.error({
                            message: "Failed to add message",
                            error: err,
                            url: req.url,
                            method: req.method
                        });
                        res.send({success: false, message: err || "Failed to add message"})
                    })
                }
            }
            catch(err) {
                errorLogger.error({
                    message: "Failed to add message",
                    error: err || null,
                    url: req.url,
                    method: req.method
                })
                res.send({success: false, message: err || "Failed to add message"})
            }

        });

        this.router.post("/newProduct", (req :any, res :any) => {
            try {
                if(req.session.user == undefined){
                    let error = {success: false, message: "not_logged"};
                    errorLogger.error({
                        message: "User not logged in",
                        url: req.url,
                        method: req.method
                    })
                    res.send(error)
                } else {
                    let product = req.body;
                    Object.assign(product, {price: parseInt(product.price)});
                    productDbManager.save(product).then(() => {
                        productDbManager.getAll().then(products => {
                            this.io.sockets.emit("products", {products: products})
                            res.send({success: true})
                        })
                    })
                    .catch(err => {
                        errorLogger.error({
                            message: "Failed to add product",
                            error: err,
                            url: req.url,
                            method: req.method
                        });
                        res.send({success: false, message: err || "Failed to add product"})
                    })
                }
            }
            catch(err) {
                errorLogger.error({
                    message: "Failed to add product",
                    error: err,
                    url: req.url,
                    method: req.method
                });
                res.send({success: false, message: err || "Failed to add product"})
            }
        });
        this.router.get("/userData", (req :any, res :any) => {
            res.send(req.session.user.name)
        })

        this.router.get("/logOff", (req :any, res :any) => {
            req.logout((err :any) => {
                if(err) return res.send("failed to close session")
                    req.session.destroy((err :any) => {
                        console.log(err);
                    });
                    res.redirect("/")
            })
        })


        //WEBSOCKETS
        this.io.on("connection", (socket :Socket) => {
            productDbManager.getAll().then(products => {
                socket.emit("products", {products: products})
            })
            messageManager.getAll().then(messages => {
                socket.emit("messages", {messages: messages})
            })
        })

        this.router.get("*", (req :Request, res :Response) => {
            warningLogger.warn({
                message: "Route not found",
                url: req.url,
                method: req.method
            })
            res.sendStatus(404);
        })
        */
    }
}


