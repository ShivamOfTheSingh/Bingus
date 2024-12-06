import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import * as MessageAPI from "./api/messages";
import cors from "cors";
import https from "https";
import fs from "fs";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com", "https://bingus.website"],
    methods: ["GET", "POST"],
    credentials: true,
}));

const server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/fullchain.pem', 'utf8')
}, app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com", "https://bingus.website"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    socket.on("authenticate", async (session) => {
        const userId = await authenticate(session);
        if (userId === -1) {
            socket.emit("authenticate", false);
        } else {
            socket.emit("authenticate", true);

            socket.on("joinChatroom", (chatId) => {
                if (!chatId) {
                    console.error("Invalid chatId received:", chatId);
                    socket.emit("error", "Invalid chatId");
                    return;
                }
                const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
                rooms.forEach((room) => socket.leave(room));

                socket.join(chatId.toString());
                console.log(`Client joined chatroom: ${chatId}`);
            });

            socket.on("loadMessages", async (chatId) => {
                const messages = await MessageAPI.GET(chatId);
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            socket.on("leaveChatroom", () => {
                const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
                rooms.forEach((room) => {
                    socket.leave(room);
                    console.log(`Client left chatroom: ${room}`);
                });
            });

            socket.on("message", async (chatId, message) => {
                const messageObject = JSON.parse(message);
                messageObject.userId = userId;
                messageObject.chatId = chatId;

                const existingMessages = await MessageAPI.GET(chatId);
                if (typeof existingMessages === "string") {
                    console.error("Error fetching messages:", existingMessages);
                    return;
                }

                await MessageAPI.POST(messageObject);
                socket.to(chatId.toString()).emit("message", JSON.stringify(messageObject));
            });
        }
    });
});

app.get("/online", (req, res) => {
    res.send("Server is online");
});

server.listen(443, () => {
    console.log("Starting on port 443");
});
