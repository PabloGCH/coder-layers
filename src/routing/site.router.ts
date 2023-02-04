import express, { Response } from "express";

const router = express.Router();

router.get("/login", (req :any, res :any) => {
    if(req.session.user){
        res.redirect("/stock")
    } else {
        res.sendFile("public/site/site.html", {root: __dirname + "/../"})
    }
})
router.get("/register", (req :any,res :any) => {
    res.sendFile("public/client/site.html", {root: __dirname})
});
router.get("/logerror", (req :any, res :any) => {
    res.sendFile("public/client/site.html", {root: __dirname})
});
router.get("/regerror", (req :any, res :any) => {
    res.sendFile("public/client/site.html", {root: __dirname})
});
router.get("/*", (req :any, res :any) => {
    res.redirect("login")
});


export {router as siteRouter};
