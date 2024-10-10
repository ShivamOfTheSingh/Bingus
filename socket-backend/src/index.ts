import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import { Message } from "./lib/models";
import "dotenv/config";
import loadMessages from "./lib/loadMessages";
import storeMessage from "./lib/storeMessage";

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

            socket.on("message", async (message) => {
                const messageObject: Message = JSON.parse(message);
                messageObject.userId = userId;
                messageObject.chatId = 1;
                socket.broadcast.emit("message", JSON.stringify(messageObject));

                await storeMessage(messageObject);
                console.log("Message stored");
            })
        }
    });
});

server.listen(3000, () => {
    console.log("Starting on port 3000");
});