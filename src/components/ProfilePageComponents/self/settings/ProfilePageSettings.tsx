import { UserProfile, UserSettings } from "@/lib/db/models";
import formatDate from "@/lib/utils/formatDate";
import Image from "next/image";
import '@/public/ProfilePageSettingsStyle.css';

export interface ProfilePageSettingsProps {
    profile: UserProfile;
    settings: UserSettings;
    className?: string;
}

export default function ProfilePageSettings({ profile, settings, className }: ProfilePageSettingsProps) {
    return (
        <div className={`profile-container ${className}`}>
            <div className="profile-header">
                <Image 
                    src={profile.profilePicture} 
                    alt={profile.username} 
                    width={200} 
                    height={200} 
                    className="rounded-full profile-image" 
                />
            </div>
            <div className="profile-info">
                <div className="info-row">
                    <div className="info-item">
                        <div className="settings-label">Profile Visibility</div>
                        <div className="settings-info">{settings.profilePublic ? "Public" : "Private"}</div>
                    </div>
                    <div className="info-item">
                        <div className="settings-label">Username</div>
                        <div className="settings-info">{profile.username}</div>
                    </div>
                    <div className="info-item">
                        <div className="settings-label">Full Name</div>
                        <div className="settings-info">{profile.firstName} {profile.lastName}</div>
                    </div>
                </div>
                <div className="info-row">
                    <div className="info-item">
                        <div className="settings-label">Email</div>
                        <div className="settings-info">{profile.email}</div>
                    </div>
                    <div className="info-item">
                        <div className="settings-label">Birthdate</div>
                        <div className="settings-info">{formatDate(profile.birthDate)}</div>
                    </div>
                    <div className="info-item">
                        <div className="settings-label">About</div>
                        <div className="settings-info">{profile.about}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
