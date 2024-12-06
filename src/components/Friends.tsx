"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/GET_api_calls/getAllUsers";
import { UserProfile } from "@/lib/db/models";
import Link from "next/link";
import "@/public/Friends.css"

interface FriendsProps {
    userId: number;
}

const Friends: React.FC<FriendsProps> = ({ userId }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers(userId);
                setUsers(allUsers);
            } catch (err) {
                setError("Failed to fetch users. Please try again later.");
                console.error(err);
            }
        };

        fetchUsers();
    }, [userId]);

    return (
        <div className="friend-main">
            <h2>Your Friends</h2>
            {error && <p className="error">{error}</p>}
            <ul className="friends-list">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.userId} className="friend-item">
                            <Link href={`/profile/${user.userId}`} className="friend-link">
                                <div className="friend-avatar">
                                    <img
                                        src={user.profilePicture || "/default-avatar.png"} // Fallback to default avatar if none
                                        alt={`${user.username}'s profile`}
                                        className="avatar-img"
                                    />
                                </div>
                                <div className="friend-username">{user.username}</div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <p>No friends found!</p>
                )}
            </ul>
        </div>
    );
};

export default Friends;
