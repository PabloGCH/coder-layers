import { Socket, Server as SocketServer} from "socket.io";

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
