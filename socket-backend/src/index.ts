import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authenticate from "./lib/authenticate";
import { Message } from "./lib/models";
import cors from "cors"; // Import cors
import * as MessageAPI from "./api/messages";
import "dotenv/config";

const app = express();

// Add CORS middleware
app.use(cors({
    origin: "http://localhost:3000", // Allow only your frontend to access
    methods: ["GET", "POST"], // Define allowed methods
    credentials: true, // Allow cookies and authentication headers
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow WebSocket connections from your frontend
        methods: ["GET", "POST"], // Define allowed WebSocket methods
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
                const messages: Message[] | string = await MessageAPI.GET();
                socket.emit("loadMessages", JSON.stringify(messages));
            });

            socket.on("message", async (message) => {
                console.log("Message received", message);
                const messageObject: Message = JSON.parse(message);
                console.log("Message object", messageObject);
                messageObject.userId = userId;
                messageObject.chatId = 1;
                socket.broadcast.emit("message", JSON.stringify(messageObject));

                await MessageAPI.POST(messageObject);
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Starting on port 3000");
});
