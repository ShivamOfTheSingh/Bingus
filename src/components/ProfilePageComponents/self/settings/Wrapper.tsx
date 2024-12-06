"use client";

import { Button } from "react-bootstrap";
import ProfilePageSettings from "./ProfilePageSettings";
import ProfilePageSettingsForm from "./ProfilePageSettingsForm";
import { useState } from "react";
import { UserProfile, UserSettings } from "@/lib/db/models";
import "@/public/Wrapper.css";

interface WrapperProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function Wrapper({ profile, settings, className }: WrapperProps) {
    const [editing, setEditing] = useState<boolean>(false);

    const toggleEditing = () => setEditing(!editing);

    return (
        <div className={`${className} wrapper-container flex flex-col items-center p-6 bg-white shadow-md rounded-md`}>
            <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
            <Button
                onClick={toggleEditing}
                className={`mb-4 custom-button ${editing ? "cancel-button" : "edit-button"}`}
            >
                {editing ? "Cancel" : "Edit"}
            </Button>

            <div className="settings-content w-full">
                {editing ? (
                    <ProfilePageSettingsForm profile={profile} settings={settings} />
                ) : (
                    <ProfilePageSettings profile={profile} settings={settings} />
                )}
            </div>
        </div>
    );
}
