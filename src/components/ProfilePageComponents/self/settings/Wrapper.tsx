"use client";

import { Button } from "react-bootstrap";
import ProfilePageSettings from "./ProfilePageSettings";
import ProfilePageSettingsForm from "./ProfilePageSettingsForm";
import { useState } from "react";
import { UserProfile, UserSettings } from "@/lib/db/models";

interface WrapperProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function Wrapper({ profile, settings, className }: WrapperProps) {
    const [editing, setEditing] = useState<boolean>(false);

    return (
        <div className={`${className} flex justify-center`}>
            Profile Settings
            <Button onClick={() => { setEditing(!editing) }} variant={ editing ? "secondary" : "primary" }>
                { editing ? "Cancel" : "Edit" }
            </Button>
            { editing ? <ProfilePageSettingsForm profile={profile} settings={settings} /> : <ProfilePageSettings profile={profile} settings={settings} /> }
        </div>
    );
}