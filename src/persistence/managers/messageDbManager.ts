import fs from "fs";
import { DbManager } from "../scripts/dbScripts";

const dbManager :DbManager = new DbManager("messages");

export async function getAll() {
    //let file = await this.readFile();
    let answer :any = await dbManager.getObjects()
    if(answer.success) {
        return answer.response
    } else {
        throw answer.response
    }
}

export async function save(object :any) {
    let newObject = {
        email: object.email,
        date: object.date,
        message: object.message
    };
    if(newObject.message && newObject.email) {
        dbManager.addObject(newObject);
        return newObject;
    } else {
        throw "The message was empty";
    }
}

