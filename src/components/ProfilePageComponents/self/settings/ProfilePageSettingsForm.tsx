"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";

export interface ProfilePageSettingsFormProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function ProfilePageSettingsForm({ className }: ProfilePageSettingsFormProps) {
    return (
        <div>Hi</div>
    );
}