"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import getProfilePageData from "@/lib/GET_api_calls/getProfilePageData";
import ProfilePagePostGridOther from "@/components/ProfilePageComponents/other/ProfilePagePostGridOther";
import ProfilePageInfoOther from "@/components/ProfilePageComponents/other/ProfilePageInfoOther";
import { redirect } from "next/navigation";
import { Following } from "@/lib/db/models";

async function getFollowingStatus(selfId: number, otherId: number): Promise<Following> {
    const response = await fetch(`http://localhost:3000/api/crud/followings/pair?selfId=${selfId}&otherId=${otherId}`);
    if (response.status === 200) {
        const following: Following = await response.json();
        return following;
    }
    else {
        return {
            userId: selfId,
            followedUserId: otherId
        }
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const selfId = await getCurrentSessionUserId();
    if (selfId === -1) {
      return <SessionInactive />;
    }

    if (selfId === parseInt(params.id)) {
        redirect("/main/profile");
    }

    const pageData = await getProfilePageData(parseInt(params.id));

    const following = await getFollowingStatus(selfId, parseInt(params.id));

    console.log(following);
    return (
        <div>
            <ProfilePageInfoOther profile={pageData.profile} numPosts={pageData.numPosts} following={following} numFollowers={pageData.numFollowers} numFollowing={pageData.numFollowing} settings={pageData.settings} />
            <ProfilePagePostGridOther postData={pageData.posts} />
        </div>
    );
}