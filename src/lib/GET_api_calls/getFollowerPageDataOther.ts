import { UserProfile } from "../db/models";

export async function getFollowerPageDataOther(userId: number): Promise<UserProfile[]> {
    try {
        const response = await fetch(`https://bingus.website/api/crud/user_profile/followers/${userId}`);
        const users: UserProfile[] = await response.json();
        return users;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}