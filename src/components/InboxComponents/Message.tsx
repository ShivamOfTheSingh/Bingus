import React from "react";
import "@/public/Message.css";
// Define the types for props
interface MessageProps {
  type: "me" | "other"; // "me" for the current user's messages, "other" for others
  text: string; // Message content
  position?: "last";
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({
  type,
  text,
  position,
  timestamp,
}) => {
  // Convert the timestamp string to a Date object
  const timestampDate = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const timeString = timestampDate.toLocaleString("en-US", options);
  return (
    <div className={"Message" + " " + type}>
      <div className="bubble-container">
        <div className="bubble">{text}</div>
      </div>
      <div className={"timestamp" + " " + type}>
        {/* If it's the last message in a sequence, display the timestamp and sender */}
        {position === "last" ? <p>{timeString}</p> : null}
      </div>
    </div>
  );
};

export default Message;
