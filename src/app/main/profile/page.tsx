"use server";

import ProfilePageInfo from "@/components/ProfilePageComponents/ProfilePageInfo";
import ProfilePagePostGrid from "@/components/ProfilePageComponents/ProfilePagePostGrid";
import getProfilePageData from "@/lib/api_calls/getProfilePageData";
import getCurrentSession from "@/lib/cookies/getCurrentSession";

export default async function Page() {
  const userId = await getCurrentSession();
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