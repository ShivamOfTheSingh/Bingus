import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  name: string;
  message: string;
}

// Initialize the socket connection
const socket: Socket = io("http://ec2-3-90-106-242.compute-1.amazonaws.com:3000");

function App() {
  const [userName, setName] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [history, setHistory] = useState<Message[]>([]);

  useEffect(() => {
    // Listen for socket connection
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    // Listen for disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    // Listen for incoming messages
    socket.on("message", (name: string, message: string) => {
      setHistory((history) => [...history, { name, message }]);
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (userName && msg) {
      socket.emit("message", {
        name: userName,
        message: msg,
      });
      setMsg('');  // Clear the message input after sending
    }
  };

  return (
    <div>
      <input
        placeholder="Set Your Username"
        value={userName}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Type your message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {history.map((item, index) => (
          <li key={index}>
            <p>{JSON.stringify(item)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
