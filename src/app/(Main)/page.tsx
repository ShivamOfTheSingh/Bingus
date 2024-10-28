"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import SessionInactive from "@/components/SessionInactive";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        return <SessionInactive />;
    }

    return (
        <div className="flex justify-center">
            <div>This is the main page</div>
        </div>
    );
}