"use client";
import React, { useEffect, useState, useRef } from "react";
import MessageComponent from "./Message";
import { Message } from "@/lib/db/models";
import "@/public/Inbox.css";
import { socket as newSocket } from "@/socket";

export default function Inbox({
  session,
  userId,
  chatId,
}: {
  session: string;
  userId: number;
  chatId: number;
}) {
  console.log("rendering inbox component");

  const messageListRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState(newSocket);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    console.log("Connecting socket for chatId:", chatId);

    if (socket.connected) {
      socket.disconnect();
    }
    socket.connect();

    const onAuthenticate = (authenticated: boolean) => {
      if (!authenticated) {
        console.error("Authentication failed!");
        throw new Error("Authentication failed!");
      }
      socket.emit("joinChatroom", chatId);
      socket.emit("loadMessages", chatId);
    };

    const onLoadMessages = (messages: string) => {
      const messageObjects: Message[] = JSON.parse(messages);
      console.log("Loaded messages:", messageObjects);
      setMessages(messageObjects);
      scrollToBottom();
    };

    const onMessage = (message: string) => {
      const mObject: Message = JSON.parse(message);
      console.log("Received message:", mObject);

      setMessages((prevMessages) => {
        const exists = prevMessages.some(
          (msg) =>
            msg.messageText === mObject.messageText &&
            msg.messageTime === mObject.messageTime &&
            msg.userId === mObject.userId
        );
        if (exists) return prevMessages;

        return [...prevMessages, mObject];
      });
      scrollToBottom();
    };

    socket.off("authenticate");
    socket.off("loadMessages");
    socket.off("message");

    socket.on("authenticate", onAuthenticate);
    socket.on("loadMessages", onLoadMessages);
    socket.on("message", onMessage);

    socket.emit("authenticate", session);

    return () => {
      socket.off("authenticate", onAuthenticate);
      socket.off("loadMessages", onLoadMessages);
      socket.off("message", onMessage);
      socket.disconnect();
    };
  }, [chatId, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }

    console.log("Sending message: ", message);
    if (socket) {
      const newMessage: Message = {
        messageText: message,
        messageTime: new Date(),
        userId: userId,
      };
      socket.emit("message", chatId, JSON.stringify(newMessage));
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      scrollToBottom();
    } else {
      alert("Socket not connected");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="inbox">
      <div className="inbox-content">
        <div className="message-list-container scrollable" ref={messageListRef}>
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
            onKeyDown={handleKeyPress}
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
