import FollowCardOther from "@/components/Followers/FollowCardOther"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";
import { getFollowerPageDataOther } from "@/lib/GET_api_calls/getFollowerPageDataOther";
import { UserProfile } from "@/lib/db/models";


export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      redirect("/login");
    }
    const followers = await getFollowerPageDataOther(parseInt(params.id));

    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Followers</h3>
                {followers.map((profile: UserProfile) => <FollowCardOther profile={profile} />)}
            </div>
        </div>
    );
};