import { UserProfile, Following } from "../db/models";

interface SubReturnData {
    profile: UserProfile;
    following: Following;
}

interface ReturnData {
    following: SubReturnData[];
    suggested: SubReturnData[];
}

export async function getAllUsers(userId: number): Promise<UserProfile[]> {
    try {
        // 1. Get all users
        const usersResponse = await fetch("https://bingus.website//api/crud/user_profile");
        const users: UserProfile[] = await usersResponse.json();

        // 2.  filter out yourself
        const usersFiltered: UserProfile[] = users.filter((u: UserProfile) => u.userId !== userId);

        return usersFiltered;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}