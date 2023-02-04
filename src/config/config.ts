import express from 'express';
import session from "express-session";
import MongoStore from "connect-mongo";
import { configureLogger } from "./logger/logger";
import { configurePassport } from './passport/passport';
import { logger } from "../services/logger.service";
import path from "path";
import cookieParser from "cookie-parser";
import {engine} from "express-handlebars";


export function loadConfig(app: express.Application) {

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use((req :any, res :any, next :any) => {logger.info({message: "Request",url: req.url,method: req.method}); next();});
    const TEMPLATEFOLDER = path.join(__dirname, "public/templates");
    app.engine("handlebars", engine())
    app.set("views", TEMPLATEFOLDER)
    app.set("view engine", "handlebars")
    app.use(cookieParser());
    app.use(session({
        store: MongoStore.create({mongoUrl: process.env.MONGODB_URL}),
        secret: "dfvartg4wfqR3EFRQ3",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 10 // 1 segundo * 60 * 10 = 10 minutos
        }
    }))
    configureLogger();
    configurePassport(app);
};
