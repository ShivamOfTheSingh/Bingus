"use client";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Message from "./Message";
import "@/public/Inbox.css";

const Inbox: React.FC = () => {
  // State to store current message
  const [message, setMessage] = useState("");

  // State to update list of messages
  const [messages, setMessages] = useState([]);

  // State to store socket instance
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the socket server
    const newSocket = io("wss://api.bingus.website/");
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("message", (message: any) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Get current user id
    // const currentUserId = id

    // Alert if message input is empty
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }

    // If socket connection exists, then send the message
    if (Socket) {
      const newMessage = {
        text: message,
        // Change the sender to user id
        sender: "me",
        timestamp: new Date().toISOString(),
        position: "last",
      };

      socket.emit("message", newMessage);
      setMessage("");
    }

    // Else alert socket isn't connected
    else {
      alert("Socket not connected");
    }
  };

  // Press enter to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="inbox">
      <h1>Inbox</h1>

      {/* input to type message */}
      <div className="inbox-content">
        <div className="message-list-container crollable">
          {messages.map((msg, index) => (
            <Message
              key={index}
              // Check if user id is same if not the set as other
              type={msg.sender === "me" ? "me" : "other"}
              text={msg.text}
              timestamp={msg.timestamp}
              position={index === messages.length - 1 ? "last" : ""}
            />
          ))}
        </div>
        {/* Display the list of messages */}
        <div className="compose">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
          />
          <button className="send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
