import FollowCardOther from "@/components/Followers/FollowCardOther"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import { getFollowingPageDataOther } from "@/lib/GET_api_calls/getFollowingPageDataOther";
import { UserProfile } from "@/lib/db/models";


export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }
    const following = await getFollowingPageDataOther(parseInt(params.id));

    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Following</h3>
                {following.map((profile: UserProfile) => <FollowCardOther profile={profile} />)}
            </div>
        </div>
    );
};