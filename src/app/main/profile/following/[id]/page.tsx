import UserProfile from "@/components/Followers/UserProfileCardFollower"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import { getFollowingPageData } from "@/lib/GET_api_calls/getFollowingPageData";


export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }
    const pageData = await getFollowingPageData(parseInt(params.id));
    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Followers</h3>
                {pageData.length > 0 ? (
                    pageData.map((user, index) => (
                        <UserProfile key={index} userProfile={user} />
                    ))
                ) : (
                    <p>No suggestions available.</p>
                )}
            </div>
        </div>
    );
};