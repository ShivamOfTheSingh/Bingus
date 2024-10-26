"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";

export interface ProfilePageSettingsProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function ProfilePageSettings({ className }: ProfilePageSettingsProps) {
    return (
        <div>Hello</div>
    );
}