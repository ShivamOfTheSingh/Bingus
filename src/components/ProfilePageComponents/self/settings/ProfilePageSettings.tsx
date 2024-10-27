import { UserProfile, UserSettings } from "@/lib/db/models";
import formatDate from "@/lib/utils/formatDate";
import Image from "next/image";

export interface ProfilePageSettingsProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function ProfilePageSettings({ profile, settings, className }: ProfilePageSettingsProps) {
    return (
        <div className={className}>
            <div>
                <Image src={profile.profilePicture} alt={profile.username} />
            </div>
            <div>
                <div>Profile Visibility</div>
                <div>{settings.profilePublic ? "Public" : "Private"}</div>
            </div>
            <div>
                <div>Username</div>
                <div>{profile.username}</div>
            </div>
            <div>
                <div>Full Name</div>
                <div>{profile.firstName} {profile.lastName}</div>
                <div>Full Name Visibility</div>
                <div>{settings.showName ? "Public" : "Private"}</div>
            </div>
            <div>
                <div>Email</div>
                <div>{profile.email}</div>
            </div>
            <div>
                <div>Birthdate</div>
                <div>{formatDate(profile.birthDate)}</div>
            </div>
            <div>
                <div>About</div>
                <div>{profile.about}</div>
            </div>
        </div>
    );
}