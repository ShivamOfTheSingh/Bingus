import FollowCardSelf from "@/components/Followers/FollowCardSelf"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import { getFollowerPageData } from "@/lib/GET_api_calls/getFollowerPageDataSelf";


export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }
    const { followers, suggested } = await getFollowerPageData(userId);

    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Followers</h3>
                {followers.map((f: any) => <FollowCardSelf profile={f.profile} following={f.following} />)}
                <h3>Suggested</h3>
                {suggested.map((s: any) => <FollowCardSelf profile={s.profile} following={s.following} />)}
            </div>
        </div>
    );
};