import { UserProfile, Following } from "../db/models";

interface SubReturnData {
    profile: UserProfile;
    following: Following;
}

interface ReturnData {
    following: SubReturnData[];
    suggested: SubReturnData[];
}

export async function getFollowingPageData(userId: number): Promise<ReturnData> {
    try {
        // 1. Get all users
        const usersResponse = await fetch("https://bingus.website/api/crud/user_profile");
        const users: UserProfile[] = await usersResponse.json();

        // 2.  filter out yourself
        const usersFiltered: UserProfile[] = users.filter((u: UserProfile) => u.userId !== userId);

        // 3. For each user, get an existing following or create a new one where userId = your id and following id = their id
        // 4. Filter users you already follow into following, and users for which following was just created into suggested
        const followingReturnData: SubReturnData[] = [];
        const suggestedReturnData: SubReturnData[] = [];
        for (let i = 0; i < usersFiltered.length; i++) {
            const followingResponse = await fetch(`https://bingus.website/api/crud/followings/pair?selfId=${userId}&otherId=${usersFiltered[i].userId}`);
            if (followingResponse.status === 200) {
                const following: Following = await followingResponse.json();
                followingReturnData.push({
                    profile: usersFiltered[i],
                    following: following
                });
            }
            else {
                const following: Following = {
                    userId: userId,
                    followedUserId: usersFiltered[i].userId || -1
                };
                suggestedReturnData.push({
                    profile: usersFiltered[i],
                    following: following
                });
            }
        }

        return {
            following: followingReturnData,
            suggested: suggestedReturnData
        };
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}