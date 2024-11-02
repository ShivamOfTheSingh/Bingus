import { notFound } from "next/navigation";
import { Following } from "../db/models";

interface ReturnData {
    userId: number;
    followedUserId: number;
}

export async function getFollower(userId: number, followedUserId: number): Promise<ReturnData> { 
    const response = await fetch('https://damian-codecleanup.d3drl1bcjmxovs.amplifyapp.com/api/crud/followings/${userId}')
    if (response.status === 404) notFound();
    const profile: Following = await response.json();
    return {
        userId: userId,
        followedUserId: followedUserId
      }
}