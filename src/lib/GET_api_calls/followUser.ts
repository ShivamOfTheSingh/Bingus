import { notFound } from "next/navigation";
import { Following } from "../db/models";

interface ReturnData {
    userId: number;
    followedUserId: number;
}

/**
 * Function to follow a user by ID
 * @param {number} userId The ID of the current user
 * @param {number} followedUserId The ID of the user to follow
 * @returns {Promise<ReturnData>} The response from the follow action
 */
export async function followUser(userId: number, followedUserId: number): Promise<ReturnData> {
    try {
        const response = await fetch('https://bingus.website//api/crud/followings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, followedUserId })
        });
        /*
        if (!response.ok) {
            throw new Error(`Failed to follow user: ${response.statusText}`);
        }
        */
        const data: ReturnData = await response.json();
        return data; // Assuming your API returns { userId, followedUserId }
    } catch (error) {
        console.error("Error following user:", error);
        throw error;
    }
}

/**
 * Function to unfollow a user by ID
 * @param {number} userId The ID of the current user
 * @param {number} followedUserId The ID of the user to unfollow
 * @returns {Promise<ReturnData>} The response from the unfollow action
 */
export async function unfollowUser(followingId: number): Promise<boolean> {
    try {
        const response = await fetch('https://bingus.website//api/crud/followings', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: followingId })
        });
        /*
        if (!response.ok) {
            throw new Error(`Failed to unfollow user: ${response.statusText}`);
        }
        */
        return response.status === 200; // Assuming your API returns { userId, followedUserId }
    } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
    }
}