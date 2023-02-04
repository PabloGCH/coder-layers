import express from "express";
import { UserModel } from "../persistence/schemas/user";
import passport from "passport";
import bcrypt from "bcrypt";

const router = express.Router();


router.post("/register", passport.authenticate("signupStrategy", {
    failureRedirect: "/register",
    failureMessage: true
}), (req :any, res :any) => {
    res.send({success: req.success || false, message: req.message||""})
});

router.get("/logOff", (req :any, res :any) => {
    req.logout((err :any) => {
        if(err) return res.send("failed to close session")
            req.session.destroy((err :any) => {
                console.log(err);
            });
            res.redirect("/")
    })
})

router.post("/login", (req:any, res :any) => {
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


export { router as authRouter }
