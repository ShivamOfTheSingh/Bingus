// components/Heartbeat.js
"use client";

import { useEffect } from "react";

export default function Heartbeat({ userId }) {
    useEffect(() => {
        if (!userId) return; // Do nothing if userId is not provided

        const interval = setInterval(() => {
            fetch(`/online?userId=${userId}`, { method: "GET", credentials: "include" })
                .then((response) => response.text())
                .then((data) => console.log("Heartbeat:", data))
                .catch((error) => console.error("Error sending heartbeat:", error));
        }, 30000);

        return () => clearInterval(interval);
    }, [userId]);

    return null;
}
