"use client";
import React, { useEffect, useState } from "react";
import MessageComponent from "./Message";
import { Message } from "@/lib/db/models";
import "@/public/Inbox.css";
import { socket as newSocket } from "@/socket";

export default function Inbox({
  session,
  userId,
}: {
  session: string;
  userId: number;
}) {
  console.log("rendering inbox component");
  // State to store current message
  const [message, setMessage] = useState("");

  // State to update list of messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State to store socket instance
  const [socket, setSocket] = useState(newSocket);


  useEffect(() => {
    console.log("running useEffect");
    socket.emit("authenticate", session);

    const onLoadMessages = (messages: string) => {
      const messageObjects: Message[] = JSON.parse(messages);
      console.log(messageObjects);
      setMessages(messageObjects);
    };

    const onMessage = (message: string) => {
      const mObject: Message = JSON.parse(message);
      console.log("Message: ", message);
      setMessages((prevMessages) => [...prevMessages, mObject]);
    }

    const onAuthenticate = (authenticated: boolean) => {
      if (!authenticated) {
        throw new Error("What the bingus?");
      }
      socket.emit("loadMessages");
      socket.on("loadMessages", onLoadMessages);
      socket.on("message", onMessage);
    }

    socket.on("authenticate", onAuthenticate);

    return () => {
      socket.off("authenticate", onAuthenticate);
      socket.off("loadMessages", onLoadMessages);
      socket.off("message", onMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }
          console.log("Messages: ", messages);
    if (socket) {
      const newMessage: Message = {
        messageText: message,
        messageTime: new Date(),
        userId: userId,
      };
      socket.emit("message", JSON.stringify(newMessage));
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }

    else {
      alert("Socket not connected");
    }
  };

  return (
    <div className="inbox">
      <h1>Inbox</h1>

      {/* input to type message */}
      <div className="inbox-content">
        <div className="message-list-container scrollable">
          {messages.map((msg, index) => (
            <MessageComponent
              key={index}
              type={msg.userId === userId ? "me" : "other"}
              message={msg}
              position={index === messages.length - 1 ? "last" : ""}
            />
          ))}
        </div>
        <div className="compose">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button className="send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
