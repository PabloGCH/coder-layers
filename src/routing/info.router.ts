import express, { Response } from "express";
import compression from "compression";
import { getServerInfo } from "../controllers/info.controller";


const router = express.Router();

router.get("/server", compression(), getServerInfo)
router.get("/user", (req :any, res :any) => {
    res.send(req.session.user.name)
})

export { router as infoRouter };


