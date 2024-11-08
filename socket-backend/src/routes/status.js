import express from "express";

const router = express.Router();
const onlineUsers = new Map();

const removeInactiveUsers = () => {
    const currentTime = Date.now();
    for (const [userId, lastActiveTime] of onlineUsers.entries()) {
        if (currentTime - lastActiveTime > 60000) {
            onlineUsers.delete(userId);
        }
    }
};

setInterval(removeInactiveUsers, 60000);

router.get("/", (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        onlineUsers.set(userId, Date.now());
        res.send(`User ${userId} is now online`);
    } else {
        res.status(400).send("userId query parameter is required");
    }
});

router.get("/users", (req, res) => {
    res.json(Array.from(onlineUsers.keys()));
});

export default router;
