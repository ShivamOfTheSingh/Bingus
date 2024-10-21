import { UserProfile } from "../db/models";

export async function getFollowingPageData(userId: number): Promise<UserProfile[]> {
    try {
        const response = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_profile/followings/${userId}`);
        const users: UserProfile[] = await response.json();
        return users;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}