import UserProfile from "@/components/Followers/UserProfileCardFollower"
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";
import { getSuggestedUsers } from "@/lib/GET_api_calls/getSuggestedUsers";


export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
      return <SessionInactive />;
    }
    const pageData = await getSuggestedUsers(userId);
    return (
        <div>
            <div className="container" style={{paddingLeft: '200px'}} >
                <h3>Suggested Users</h3>
                {pageData.length > 0 ? (
                    pageData.map((user, index) => (
                        <UserProfile key={index} userProfile={user.user} following={user.following} />
                    ))
                ) : (
                    <p>No suggestions available.</p>
                )}
            </div>
        </div>
    );
};