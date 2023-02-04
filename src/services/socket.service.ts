import { Socket, Server as SocketServer} from "socket.io";
import * as productDbManager from "../persistence/managers/productsDbManager";
import * as messageManager from "../persistence/managers/messageDbManager";

export function startConnectionEvents(io :SocketServer) {
    io.on("connection", (socket :Socket) => {
        productDbManager.getAll().then(products => {
            socket.emit("products", {products: products})
        })
        messageManager.getAll().then(messages => {
            socket.emit("messages", {messages: messages})
        })
    })
}
