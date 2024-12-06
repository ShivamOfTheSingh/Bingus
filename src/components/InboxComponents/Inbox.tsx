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

  // State to store current message
  const [message, setMessage] = useState("");

  // State to update list of messages
  const [messages, setMessages] = useState<Message[]>([]);

  // State to store socket instance
  const [socket, setSocket] = useState(newSocket);

  // Auto scroll for message container
  const scrollToBottom = () => {
    if(messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  // Socket management
  useEffect(() => {
    console.log("Connecting socket for chatId:", chatId);

    // Disconnect and reconnect socket to prevent duplication errors
    if (socket.connected) {
        socket.disconnect();
    }
    socket.connect();

    // Authenticate user, join chatroom, and load messges
    const onAuthenticate = (authenticated: boolean) => {
        if (!authenticated) {
            console.error("Authentication failed!");
            throw new Error("Authentication failed!");
        }

        //socket.emit("leaveChatroom");
        socket.emit("joinChatroom", chatId);
        socket.emit("loadMessages", chatId);
    };

    // Load previous messages
    const onLoadMessages = (messages: string) => {
        const messageObjects: Message[] = JSON.parse(messages);
        console.log("Loaded messages:", messageObjects);
        setMessages(messageObjects);
        scrollToBottom();
    };

    // receive message and check if its a dupe
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

    // Clean up old listeners to prevent duplicates
    socket.off("authenticate");
    socket.off("loadMessages");
    socket.off("message");

    // Attach new listeners
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

  //scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message along with chat id
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
      // Emit message with chatid and update list of messages
      socket.emit("message", chatId, JSON.stringify(newMessage)); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
      scrollToBottom();
    } else {
      alert("Socket not connected");
    }
  };

  // Send message when pressing enter
  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
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
