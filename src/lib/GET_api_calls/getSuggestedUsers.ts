import { Following } from "../db/models";

interface UserProfile {
    userId: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    about?: string;
    profilePicture: string;
}

interface ReturnData {
    user: UserProfile,
    following: Following
}

export async function getSuggestedUsers(userId: number): Promise<ReturnData[]> {
    const usersResponse = await fetch("https://bingus.website//api/crud/user_profile");
    const users: UserProfile[] = await usersResponse.json();

    const followingsResponse = await fetch(`https://bingus.website//api/crud/followings/followingUserId/${userId}`);
    const followings: Following[] = await followingsResponse.json();

    const returnData: ReturnData[] = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].userId !== userId) {
            const following: Following = followings.filter((f: Following) => f.followedUserId === users[i].userId)[0];
            let data: ReturnData;
            if (following) {
                data = {
                    user: users[i],
                    following: following
                };
            }
            else {
                data = {
                    user: users[i],
                    following: { userId: userId, followedUserId: users[i].userId }
                };
            }
            returnData.push(data);
        }
    }
    return returnData;
}