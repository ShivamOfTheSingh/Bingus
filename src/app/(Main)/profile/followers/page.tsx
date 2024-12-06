import FollowCardSelf from "@/components/Followers/FollowCardSelf"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import { getFollowerPageData } from "@/lib/GET_api_calls/getFollowerPageDataSelf";
import "@/public/FollowersPage.css";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }
    const { followers, suggested } = await getFollowerPageData(userId);

    return (
        <div>
            <div className="container">
                <h3>Followers</h3>
                {followers.map((f: any) => <FollowCardSelf profile={f.profile} following={f.following} />)}
                <h3>Suggested</h3>
                {suggested.map((s: any) => <FollowCardSelf profile={s.profile} following={s.following} />)}
            </div>
        </div>
    );
};
