import { Request, Response } from 'express';
import { UserModel } from "../persistence/schemas/user";
import bcrypt from "bcrypt";


export function register(req : Request|any, res : Response|any) {
    res.send({success: req.success || false, message: req.message||""})
}
export function logoff(req : Response | any, res : Response) {
    req.logout((err :any) => {
        if(err) return res.send("failed to close session")
            req.session.destroy((err :any) => {
                console.log(err);
            });
            res.redirect("/")
    });
}
export function login(req : Request|any, res : Response|any) {
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
}
