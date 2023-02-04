import fs from "fs";
import { DbManager } from "../scripts/dbScripts";
const dbManager :DbManager = new DbManager("products");

export async function save(object :any) {
    let newObject :any = {};
    if(!object.name || !object.price) {
        throw "Didn't provide proper name and price"
    } else {
        if(typeof(object.name) == "string") {
            newObject.name = object.name;
        } else {
            throw "Name must be a string";
        }
        if(typeof(object.price) == "number") {
            newObject.price = object.price;
        } else {
            throw "Price must be a number";
        }
        newObject.imgUrl = object.imgUrl;
        await dbManager.addObject(newObject).then(res =>{})
    }
    return newObject;
}

export async function getAll() {
    let answer :any = await dbManager.getObjects()
    if(answer.success) {
        return answer.response
    } else {
        throw answer.response
    }
}
