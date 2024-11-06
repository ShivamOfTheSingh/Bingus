import FollowCardSelf from "@/components/Followers/FollowCardSelf"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import { getFollowingPageData } from "@/lib/GET_api_calls/getFollowingPageDataSelf";


export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      redirect("/login");
    }
    const { following, suggested } = await getFollowingPageData(userId);

    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Following</h3>
                {following.map((f: any) => <FollowCardSelf profile={f.profile} following={f.following} />)}
                <h3>Suggested</h3>
                {suggested.map((s: any) => <FollowCardSelf profile={s.profile} following={s.following} />)}
            </div>
        </div>
    );
};