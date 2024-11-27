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
import { Socket } from "dgram";

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

//const server = createServer(app);
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

            const joinChatroomListener = (chatId: number) => {
                if (!chatId) {
                    console.error("Invalid chatId received:", chatId);
                    socket.emit("error", "Invalid chatId");
                    return;
                }
                const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
                rooms.forEach((room) => socket.leave(room));

                socket.join(chatId.toString());
                console.log(`Client joined chatroom: ${chatId}`);
            };

            // Clean up listeners
            socket.off("joinChatroom", joinChatroomListener);
            socket.on("joinChatroom", joinChatroomListener);

            // Join a specific chatroom
            socket.on("joinChatroom", (chatId) => {
                // Check if chat id is valid
                if (!chatId) {
                    console.error("invalid chatid received:", chatId);
                    socket.emit("error", "invalid chatid");
                    return;
                }
                // Check if socket id is already part of the chat room
                if (!socket.rooms.has(chatId.toString())) {
                    socket.join(chatId.toString());
                    console.log(`Client joined chatroom: ${chatId}`);
                }
                //socket.join(chatId.toString());
                //console.log(`Client joined chatroom: ${chatId}`);
            });

            // Load messeages for the specific chatroom
            socket.on("loadMessages", async (chatId) => {
                const messages = await MessageAPI.GET(chatId);
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            // leave chatroom 
            socket.on("leaveChatroom", () => {
                const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
                rooms.forEach((room) => {
                    socket.leave(room);
                    console.log(`Client left chatroom: ${room}`);
                });
            });


            // Broadcast message to the specific chatroom
            socket.on("message", async (chatId, message) => {
                const messageObject = JSON.parse(message);
                messageObject.userId = userId;
                messageObject.chatId = chatId;

                //check if message alrady exists in the db before adding    
                const existingMessages = await (MessageAPI.GET(chatId));

                // Check if the response is a string (error message) or an array of messages
                if (typeof existingMessages === "string") {
                    console.error("Error fetching messages:", existingMessages);
                    return;
                }

                // Prevent duplicate message from being saved to db
                //const isDuplicate = existingMessages.some(
                //(msg) =>
                //msg.messageText === messageObject.messageText &&
                //msg.messageTime === messageObject.messageTime &&
                //msg.userId === messageObject.userId
                //);

                //if (isDuplicate) {
                //return;
                //}

                // save message to db
                await MessageAPI.POST(messageObject);

                // Emit to the specific chatroom
                //socket.broadcast.emit("message", JSON.stringify(messageObject));
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
