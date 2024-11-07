import express from "express";
import authenticate from "./lib/authenticate";

const router = express.Router();
let onlineUsers = [];

router.get("/", async (req, res) => {
    const session = req.headers.authorization;
    const userId = await authenticate(session);

    if (userId === -1) {
        return res.status(401).send("Unauthorized");
    }

    if (!onlineUsers.includes(userId)) {
        onlineUsers.push(userId);
    }

    res.json({ message: "User is authenticated and server is online", onlineUsers });
});

router.delete("/", async (req, res) => {
    const session = req.headers.authorization;
    const userId = await authenticate(session);

    if (userId === -1) {
        return res.status(401).send("Unauthorized");
    }

    onlineUsers = onlineUsers.filter(id => id !== userId);
    res.json({ message: "User logged out", onlineUsers });
});

export default router;
