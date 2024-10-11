import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import authenticate from "./src/sockets/lib/authenticate";
import { Message } from "./src/sockets/lib/models";
import * as MessageAPI from "./src/sockets/api/messages";
import "dotenv/config";

const dev = process.env.NODE_ENV !== "production";
const hostname = "production.d3drl1bcjmxovs.amplifyapp.com";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("authenticate", async (session) => {
        const userId = await authenticate(session);
        if (userId === -1) {
            socket.emit("authenticate", false);
        }
        else {
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
            })
        }
    });
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