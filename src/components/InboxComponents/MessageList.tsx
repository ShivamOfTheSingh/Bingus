"use client";
import React, { useEffect, useState } from "react";
import "@/public/MessageList.css";
import { UserProfile, CreateNewChat } from "@/lib/db/models";
import Link from "next/link";

interface DM {
  username: string;
  lastMessage: string;
  chatid: number;
  //avatar: idk;
}

// interface for username
interface DMListProp {
  username: string;
  currentUserId: number;
  //dms: DM[];
  profiles: UserProfile[];
}

const MessageList = ({ username, currentUserId, profiles }: DMListProp) => {
  // State to store searched user
  const [searchUser, setSearchUser] = useState("");

  // State to store all users to start new chat
  const [users, setUsers] = useState<UserProfile[]>([]);

  //State to store existing dms/chatrooms
  const [dms, setDms] = useState<DM[]>([]);

  //State to store currently selected chat room; -1 means no chat room selected
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  // Set list of profiles on mount
  useEffect(() => {
    setUsers(profiles);
  }, [profiles]);

  // Get list of existing chats
  useEffect(() => {
    //const fetchChats = async () => {
      //try {
        //const response = await fetch("/api/crud/create_chat", {
          //method: "GET",
          //headers: {
          //  "Content-Type": "application/json",
         // },
        //});

       // if (!response.ok) {
       //  console.error("Failed to fetch chats");
        //  return;
       // }

        //const chats = await response.json();
       // setDms(chats);
     // } catch (error) {
      //  console.error("Error fetching chats:", error);
     // }
    //};

    fetchChats();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Get all existing chats
  const fetchChats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/crud/create_chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch chats");
        return;
      }

      const chats = await response.json();
      setDms(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Start new chat
  const startChat = async ({ selfUserId, otherUserId }: CreateNewChat) => {
    try {
      const response = await fetch("http://localhost:3000/api/crud/create_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: selfUserId,
          selectedUserId: otherUserId,
        }),
      });

      const data = await response.json();
      console.log(`Chat ID: ${data.chatId}`, data.message);

      setSearchUser("");

      // Refresh chat list after starting a new chat
      fetchChats();
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  return (
    <div className="container">
      {/* New Left Navbar for Messages */}
      <div className="messagesList">
        <h2 className="username">{username}</h2>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>

        {/* Display Filtered Users or No User Message */}
        {searchUser && (
          <div className="userSearchResults">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.userId} className="userSearchItem">
                  <div className="avatar">A</div>
                  <div className="userDetails">
                    <p className="username">{user.username}</p>
                    <button
                      className="startChatButton"
                      onClick={() => {
                        console.log(
                          "starting chat with:",
                          currentUserId,
                          user.userId
                        );
                        startChat({
                          selfUserId: currentUserId,
                          otherUserId: user.userId!,
                        });
                      }}
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="noUserFound">User does not exist</div>
            )}
          </div>
        )}

        {/* existing chat rooms */}

        <div className="dmList">
          {dms.length > 0 ? (
            dms.map((chat) => (
              <Link key={chat.chatid} href={`/conversations/${chat.chatid}`}>
                <div
                  className={`dmItem ${
                    selectedChatId === chat.chatid ? "selected" : ""
                  }`}
                  onClick={() => setSelectedChatId(chat.chatid)}
                >
                  <div className="avatar">A</div>{" "}
                  {/* Placeholder for chat avatar */}
                  <div className="dmDetails">
                    <p className="dmUsername">{chat.username}</p>
                    {/*<p className="lastMessage">{chat.lastMessage.length > 10 ? `${chat.lastMessage.slice(0,10)}...` : chat.lastMessage}</p>*/}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No chats available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;
