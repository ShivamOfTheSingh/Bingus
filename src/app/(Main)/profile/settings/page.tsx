"use server";

import Wrapper from "@/components/ProfilePageComponents/self/settings/Wrapper";
import { redirect } from "next/navigation";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import getProfilePageSettingsData from "@/lib/GET_api_calls/getProfilePageSettingsData";
import Link from "next/link";
import { Button } from "react-bootstrap";
import '@/public/ProfilePageSettingsStyle.css'

export default async function Page() {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    const { profile, settings } = await getProfilePageSettingsData(userId);

    return (
        <div className="flex flex-col justify-center">
            <Button variant="primary" className="button">
                <Link className = "button-text" href="/profile">Back to Profile Page</Link>
            </Button>
            <Wrapper profile={profile} settings={settings} />
        </div>
    );
}