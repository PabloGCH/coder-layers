import express from "express";
import * as productDbManager from "../persistence/managers/productsDbManager";
import { errorLogger } from "../logger/logger";

const router = express.Router();

router.post("/newProduct", (req :any, res :any) => {
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
                    //this.io.sockets.emit("products", {products: products})
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

export { router as productsRouter };
