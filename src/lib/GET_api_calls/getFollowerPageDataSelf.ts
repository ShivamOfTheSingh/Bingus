import { UserProfile, Following } from "../db/models";

interface SubReturnData {
    profile: UserProfile;
    following: Following;
}

interface ReturnData {
    followers: SubReturnData[];
    suggested: SubReturnData[];
}

export async function getFollowerPageData(userId: number): Promise<ReturnData> {
    try {
        // 1. Get all users
        const usersResponse = await fetch("https://bingus.website/api/crud/user_profile");
        const users: UserProfile[] = await usersResponse.json();

        // 2.  filter out yourself
        const usersFiltered: UserProfile[] = users.filter((u: UserProfile) => u.userId !== userId);

        const followersReturnData: SubReturnData[] = [];
        const suggestedReturnData: SubReturnData[] = [];
        for (let i = 0; i < usersFiltered.length; i++) {
            const followingResponse = await fetch(`https://bingus.website/api/crud/followings/pair?selfId=${usersFiltered[i].userId}&otherId=${userId}`);
            if (followingResponse.status === 200) {
                const innerFollowingResponse = await fetch(`https://bingus.website/api/crud/followings/pair?selfId=${userId}&otherId=${usersFiltered[i].userId}`);
                if (innerFollowingResponse.status === 200) {
                    const following: Following = await innerFollowingResponse.json();
                    followersReturnData.push({
                        profile: usersFiltered[i],
                        following: following
                    });
                }
                else {
                    const following: Following = {
                        userId: userId,
                        followedUserId: usersFiltered[i].userId || -1
                    };
                    followersReturnData.push({
                        profile: usersFiltered[i],
                        following: following
                    });
                }
            }
            else {
                const innerFollowingResponse = await fetch(`https://bingus.website/api/crud/followings/pair?selfId=${userId}&otherId=${usersFiltered[i].userId}`);
                if (innerFollowingResponse.status === 200) {
                    const following: Following = await innerFollowingResponse.json();
                    suggestedReturnData.push({
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
        }

        return {
            followers: followersReturnData,
            suggested: suggestedReturnData
        };
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}