import { UserProfile } from "../db/models";

export async function getFollowerPageData(userId: number): Promise<UserProfile[]> {
    try {
        const response = await fetch(`http://localhost:3000/api/crud/user_profile/followers/${userId}`);
        const users: UserProfile[] = await response.json();
        return users;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}