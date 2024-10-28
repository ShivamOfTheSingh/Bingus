"use server";

import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { redirect } from "next/navigation";

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    return (
        <div className="flex justify-center">
            <div>This is the main page</div>
        </div>
    );
}