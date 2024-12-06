"use client";
import React, { useEffect, useState } from "react";
import "@/public/MessageList.css";
import { UserProfile, CreateNewChat } from "@/lib/db/models";
import Link from "next/link";

interface DM {
  username: string;
  lastMessage: string;
  chatid: number;
}

interface DMListProp {
  username: string;
  currentUserId: number;
  profiles: UserProfile[];
}

const MessageList = ({ username, currentUserId, profiles }: DMListProp) => {
  const [searchUser, setSearchUser] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dms, setDms] = useState<DM[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  useEffect(() => {
    setUsers(profiles);
  }, [profiles]);

  useEffect(() => {
    fetchChats();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchUser.toLowerCase())
  );

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
      fetchChats();
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  return (
    <div className="container">
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
                      onClick={() =>
                        startChat({
                          selfUserId: currentUserId,
                          otherUserId: user.userId!,
                        })
                      }
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
        <div className="dmList">
          {dms.length > 0 ? (
            dms.map((chat) => (
              <Link key={chat.chatid} href={`/conversations/${chat.chatid}`}>
                <div
                  className={`dmItem ${selectedChatId === chat.chatid ? "selected" : ""
                    }`}
                  onClick={() => setSelectedChatId(chat.chatid)}
                >
                  <div className="avatar">A</div>
                  <div className="dmDetails">
                    <p className="dmUsername">{chat.username}</p>
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
