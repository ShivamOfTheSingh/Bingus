"use server";

import ProfilePageInfoSelf from "@/components/ProfilePageComponents/self/ProfilePageInfoSelf";
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
    console.log(pageData);
    return (
        <div>
            <div>
              <ProfilePageInfoSelf profile={pageData.profile} numPosts={pageData.numPosts} numFollowers={pageData.numFollowers} numFollowing={pageData.numFollowing} settings={pageData.settings} />
              <ProfilePagePostGridSelf postData={pageData.posts} />
              
            </div>
        </div>
    );
}