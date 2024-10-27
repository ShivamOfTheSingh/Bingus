"use server";

import { getFollowerPageData } from "@/lib/GET_api_calls/getFollowerPageDataSelf";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";

export default async function Page() {

    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }

    const pageData = await getFollowerPageData(userId);
    // users that follow you
    const followingUsers = pageData.filter((data: any) => data.following.followingId);

    // users that dont follow you
    const suggestedUsers = pageData.filter((data: any) => !data.following.followingId);

    return (
        <div>Hello world</div>
    );
}