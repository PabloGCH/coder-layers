import { Request, Response } from "express";
import os from "os";
const NUMBEROFCORES = os.cpus().length;

export function getServerInfo(req: Request, res: Response) {
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
}
