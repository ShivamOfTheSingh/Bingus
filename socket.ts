import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import authenticate from "./src/sockets/lib/authenticate";
import { Message } from "./src/sockets/lib/models";
import * as MessageAPI from "./src/sockets/api/messages";
import "dotenv/config";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        socket.on("authenticate", async (session) => {
            const authenticated = await authenticate(session);
            if (authenticated) {
                onAuthenticateSuccess();
            }
            else {
                onAuthenticateFailed();
            }
        });

        function onAuthenticateSuccess() {
            socket.emit("authenticate", true);
            socket.on("loadMessages", onLoadMessages);
            socket.on("message", onMessage);
        }

        function onAuthenticateFailed() {
            socket.emit("authenticate", false);
        }

        async function onLoadMessages() {
            const messages: Message[] | string = await MessageAPI.GET();
            socket.emit("loadMessages", JSON.stringify(messages));
        }

        async function onMessage(message: string) {
            const messageObject: Message = JSON.parse(message);
            messageObject.chatId = 1;
            socket.broadcast.emit("message", JSON.stringify(messageObject));
            await MessageAPI.POST(messageObject);
        }
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});