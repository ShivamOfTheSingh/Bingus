"use server";

import ProfilePageInfo from "@/components/ProfilePageComponents/ProfilePageInfo";
import ProfilePagePostGrid from "@/components/ProfilePageComponents/ProfilePagePostGrid";
import SessionInactive from "@/components/SessionInactive";
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1){
      return <SessionInactive />;
    }

    const pageData = await getProfilePageData(userId);
    return (
        <div>
            <div>
              <ProfilePageInfo profile={pageData.profile} numPosts={pageData.numPosts} />
              <ProfilePagePostGrid postData={pageData.posts} />
            </div>
        </div>
    );
}