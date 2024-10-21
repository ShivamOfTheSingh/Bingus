import { Following } from "../db/models"

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

export async function getFollowerPageData(userId: number): Promise<ReturnData[]> {
    try {
        const usersResponse = await fetch("http://localhost:3000/api/crud/user_profile");
        const users: UserProfile[] = await usersResponse.json();

        const followingsResponse = await fetch(`http://localhost:3000/api/crud/followings/followedUserId/${userId}`);
        const followings: Following[] = await followingsResponse.json();

        const returnData: ReturnData[] = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].userId !== userId) {
                const followingsFiltered = followings.filter((f: Following) => f.userId === users[i].userId);
                const data = {
                    user: users[i],
                    following: followingsFiltered.length !== 0 ? followingsFiltered[0] : { userId: users[i].userId, followedUserId: userId } 
                };
                returnData.push(data);
            }
        }

        return returnData;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}