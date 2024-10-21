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

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com"], // Allow multiple origins
    methods: ["GET", "POST"], // Define allowed HTTP methods
    credentials: true, // Allow cookies and authentication headers
};
app.use(cors(corsOptions));

// HTTPS Server Configuration
const serverOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.bingus.website/fullchain.pem', 'utf8')
};
const server = https.createServer(serverOptions, app);

// Socket.IO Configuration
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://production.d3drl1bcjmxovs.amplifyapp.com"], // Allow WebSocket connections from multiple origins
        methods: ["GET", "POST"], // Define allowed WebSocket methods
        credentials: true,
    },
});

// Socket.IO Connection Handling
io.on("connection", (socket) => {
    console.log("New socket connection established");

    socket.on("authenticate", async (session) => {
        const userId = await authenticate(session);
        if (userId === -1) {
            socket.emit("authenticate", false);
            return;
        }
        socket.emit("authenticate", true);

        setupMessageHandlers(socket, userId); // Handle message-related events
    });
});

// Setup message-related socket events
const setupMessageHandlers = (socket, userId) => {
    socket.on("loadMessages", async () => {
        const messages = await loadMessages();
        socket.emit("loadMessages", messages);
    });

    socket.on("message", async (message) => {
        console.log("Message received:", message);
        const messageObject = JSON.parse(message);
        messageObject.userId = userId;
        messageObject.chatId = 1;

        io.emit("message", JSON.stringify(messageObject)); // Broadcast to all connected clients
        await MessageAPI.POST(messageObject);
    });
};

// Load Messages Helper Function
const loadMessages = async () => {
    try {
        const messages = await MessageAPI.GET();
        return JSON.stringify(messages);
    } catch (error) {
        console.error("Error loading messages:", error);
        return "[]"; // Return an empty array in case of failure
    }
};

// Start Server on Port 443
server.listen(443, () => {
    console.log("Server started on port 443");
});
