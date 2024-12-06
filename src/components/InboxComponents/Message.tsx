import React from "react";
import "@/public/Message.css";
import { Message } from "@/lib/db/models";

interface MessageProps {
  type: "me" | "other";
  position: "last" | "";
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ type, position, message }) => {
  const timestampDate = message.messageTime ? new Date(message.messageTime) : null;
  const timeString = timestampDate
    ? timestampDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    : "";

  return (
    <div className={`Message ${type}`}>
      <div className="bubble-container">
        <div className="bubble">{message.messageText || "Message not available"}</div>
      </div>
      {position === "last" && (
        <>
          {timeString && (
            <div className={`timestamp ${type}`}>
              <p>{timeString}</p>
            </div>
          )}
          <div className="gif-container">
            <img
              src="https://cdn3.emoji.gg/emojis/5214-dancing-sphynx-cat.gif"
              alt="Dancing Sphynx Cat"
              className="dancing-cat"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MessageComponent;
