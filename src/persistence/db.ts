import mongoose from "mongoose";

export function initDb() {
    //GLOBAL VARIABLES
    mongoose.connect(process.env.MONGODB_URL||"").then(
        () => {
            console.log("connection successful")
        },
        err => {
            console.log(err)
        }
    )
}
