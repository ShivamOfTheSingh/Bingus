import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import { Message } from "./lib/models";
import cors from "cors";
import * as MessageAPI from "./api/messages";
import "dotenv/config";
import https from "https";
import fs from "fs";

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com"],
    methods: ["GET", "POST"],
    credentials: true,
}));

const server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/fullchain.pem', 'utf8')
}, app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com"],
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

            socket.on("loadMessages", async () => {
                const messages = await MessageAPI.GET();
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            socket.on("message", async (message) => {
                const messageObject = JSON.parse(message);
                messageObject.userId = userId;
                messageObject.chatId = 1;
                socket.broadcast.emit("message", JSON.stringify(messageObject));
                await MessageAPI.POST(messageObject);
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
