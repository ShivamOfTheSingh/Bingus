import React from "react";
import "@/public/Message.css";
import { Message } from "@/lib/db/models";
// Define the types for props
interface MessageProps {
  type: "me" | "other"; // "me" for the current user's messages, "other" for others
  position?: "last";
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({
  type,
  position,
  message,
}) => {
  // Convert the timestamp string to a Date object
  const timestampDate = new Date(message.messageTime);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const timeString = timestampDate.toLocaleString("en-US", options);
  return (
    <div className={"Message" + " " + type}>
      <div className="bubble-container">
        <div className="bubble">{message.messageText}</div>
      </div>
      <div className={"timestamp" + " " + type}>
        {/* If it's the last message in a sequence, display the timestamp and sender */}
        {position === "last" ? <p>{timeString}</p> : null}
      </div>
    </div>
  );
};

export default MessageComponent;
