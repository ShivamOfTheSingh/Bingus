import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import { Message } from "./lib/models";
import "dotenv/config";
import loadMessages from "./lib/loadMessages";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on("authenticate", async (session) => {
        const userId = await authenticate(session);
        if (userId === -1) {
            socket.emit("authenticate", "Failed to authenticate");
        }
        else {
            socket.emit("authenticate", "authenticated");

            socket.on("loadMessages", async () => {
                const messages: Message[] | string = await loadMessages();
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            socket.on("message", (message) => {
                const messageObject: Message = JSON.parse(message);
                socket.broadcast.emit("message", JSON.stringify(messageObject));
            })
        }
    });
});

server.listen(3000, () => {
    console.log("Starting on port 3000");
});