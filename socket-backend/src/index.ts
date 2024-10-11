import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import { Message } from "./lib/models";
import cors from "cors";
import * as MessageAPI from "./api/messages";
import "dotenv/config";

const app = express();
app.use(cors({
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
    credentials: true
}));
const server = createServer(app);
const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",  // Allow Socket.IO requests from your frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on("authenticate", async (session) => {
        const userId = await authenticate(session);
        if (userId === -1) {
            socket.emit("authenticate", "Failed to authenticate");
        }
        else {
            socket.emit("authenticate", "Authenticated");

            socket.on("loadMessages", async () => {
                const messages: Message[] | string = await MessageAPI.GET();
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            socket.on("message", async (message) => {
                const messageObject: Message = JSON.parse(message);
                messageObject.userId = userId;
                messageObject.chatId = 1;
                socket.broadcast.emit("message", JSON.stringify(messageObject));

                await MessageAPI.POST(messageObject);
                console.log("Message stored");
            })
        }
    });
});

server.listen(3000, () => {
    console.log("Starting on port 3000");
});
