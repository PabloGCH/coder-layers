// IMPORTS
import env from "dotenv";
env.config();
import { initDb } from "./persistence/db";

initDb()
import minimist from "minimist";
import express from "express";
import cluster from "cluster";
import os from "os";
import { Socket, Server as SocketServer} from "socket.io";
import {RouterManager} from "./routing/router";
import { loadConfig } from "./config/config";
import { startConnectionEvents } from "./services/socket.service";


const NUMBEROFCORES = os.cpus().length;
const options = {default: {p: 8080, m: "FORK"}, alias:{p:"puerto", m:"mode"}};
const args = minimist(process.argv.slice(2), options);


//LOAD CONFIG FILE

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
    loadConfig(app);

    const server = app.listen(args.p, ()=>{console.log(`server listening on port ${args.p}`)});
    const io = new SocketServer(server)
    startConnectionEvents(io);
    app.use("/", new RouterManager(io).getRouter());
}



