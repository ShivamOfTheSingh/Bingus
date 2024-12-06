"use server";

import ProfilePageInfoSelf from "@/components/ProfilePageComponents/self/ProfilePageInfoSelf";
import ProfilePagePostGrid from "@/components/ProfilePageComponents/ProfilePagePostGrid";
import { redirect } from "next/navigation";
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      redirect("/login");
    }

    const pageData = await getProfilePageData(userId);

    return (
        <div>
            <div>
              <ProfilePageInfoSelf profile={pageData.profile} numPosts={pageData.numPosts} numFollowers={pageData.numFollowers} numFollowing={pageData.numFollowing} settings={pageData.settings} />
              <ProfilePagePostGrid posts={pageData.posts} />
            </div>
        </div>
    );
}