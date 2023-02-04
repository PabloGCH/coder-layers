// IMPORTS
import env from "dotenv";
env.config();
import { initDb } from "./persistence/db";

initDb()
import minimist from "minimist";
import express from "express";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import passportLocal from "passport-local";
import passport from "passport";
import path from "path";
import {engine} from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import { UserModel } from "./persistence/schemas/user";
import bcrypt from "bcrypt";
import { Socket, Server as SocketServer} from "socket.io";
import {RouterManager} from "./routing/router";
import { loadConfig } from "./config/config";
import { logger } from "./services/logger.service";

const NUMBEROFCORES = os.cpus().length;
const options = {default: {p: 8080, m: "FORK"}, alias:{p:"puerto", m:"mode"}};
const args = minimist(process.argv.slice(2), options);


//LOAD CONFIG FILE
loadConfig();

if(args.m.toUpperCase() == "CLUSTER" && cluster.isPrimary) {
	console.log("Server initialized on cluster mode");
	for(let i = 0; i < NUMBEROFCORES; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, error) => {
		//RE RUN SUB PROCESS ON FAILURE
		cluster.fork();
	})
} else {
    if(args.m.toUpperCase() == "FORK") {console.log("Server initialized on fork mode")}
    const app = express();
    const server = app.listen(args.p, ()=>{console.log(`server listening on port ${args.p}`)});
    const io = new SocketServer(server)
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use((req :any, res :any, next :any) => {logger.info({message: "Request",url: req.url,method: req.method}); next();});
    const TEMPLATEFOLDER = path.join(__dirname, "public/templates");
    app.engine("handlebars", engine())
    app.set("views", TEMPLATEFOLDER)
    app.set("view engine", "handlebars")


    const createHash = (password :string) => {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        return hash;
    }
    //APP INIT CONF
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
    //PASSPORT CONFIGURATION
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser((user :any,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((id, done)=>{
        UserModel.findById(id, (err:any, userFound :any) => {
            if(err) return done(err);
            return done(null, userFound);
        })
    })
    //REGISTER
    passport.use("signupStrategy", new passportLocal.Strategy(
        {
            passReqToCallback: true,
        },
        (req, username, password, done) => {
            UserModel.findOne({username: username}, (err:any, userFound:any) => {
                if(err) return done(err);
                if(userFound) {
                    Object.assign(req, {success: false, message: "user already exists"})
                    return done(null, userFound);
                }
                const newUser = {
                    username: username,
                    password: createHash(password)
                }
                UserModel.create(newUser, (err, userCreated) => {
                    if(err) return done(err, null, {message: "failed to register user"});
                    Object.assign(req, {success: true,message: "User created"})
                    return done(null, userCreated)
                })
            })
        }
    ));
    app.use("/", new RouterManager(io).getRouter());
}



