import express, { Response } from "express";
import compression from "compression";
import os from "os";
const NUMBEROFCORES = os.cpus().length;


const router = express.Router();

router.get("/server", compression(), (req :any, res :any) => {
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

router.get("/user", (req :any, res :any) => {
    res.send(req.session.user.name)
})

export { router as infoRouter };


