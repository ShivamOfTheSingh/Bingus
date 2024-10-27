"use server";

import Wrapper from "@/components/ProfilePageComponents/self/settings/Wrapper";
import SessionInactive from "@/components/SessionInactive";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import getProfilePageSettingsData from "@/lib/GET_api_calls/getProfilePageSettingsData";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        return <SessionInactive />;
    }

    const { profile, settings } = await getProfilePageSettingsData(userId);
    console.log(settings);
    return (
        <div>
            <Wrapper profile={profile} settings={settings} />
        </div>
    );
}