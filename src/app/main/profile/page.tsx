"use server";

import ProfilePageInfo from "@/components/ProfilePageComponents/self/ProfilePageInfoSelf";
import ProfilePagePostGridSelf from "@/components/ProfilePageComponents/self/ProfilePagePostGridSelf";
import SessionInactive from "@/components/SessionInactive";
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }

    const pageData = await getProfilePageData(userId);
    return (
        <div>
            <div>
              <ProfilePageInfo profile={pageData.profile} numPosts={pageData.numPosts} numFollowers={pageData.numFollowers} numFollowing={pageData.numFollowing} />
              <ProfilePagePostGridSelf postData={pageData.posts} />
            </div>
        </div>
    );
}