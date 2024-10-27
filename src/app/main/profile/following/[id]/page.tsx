import UserProfile from "@/components/Followers/UserProfileCardFollower"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import { getFollowingPageData } from "@/lib/GET_api_calls/getFollowingPageData";


export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }
    const { following, suggested } = await getFollowingPageData(parseInt(params.id));
    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
            <h3>Following</h3>
                {following.map((f: any) => <UserProfile profile={f.profile} following={f.following} />)}
                <h3>Suggested</h3>
                {suggested.map((s: any) => <UserProfile profile={s.profile} following={s.following} />)}
            </div>
        </div>
    );
};