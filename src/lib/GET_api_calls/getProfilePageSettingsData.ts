import { UserProfile, UserSettings } from "../db/models";

interface ReturnData {
    profile: UserProfile;
    settings: UserSettings;
}

export default async function getProfilePageSettingsData(userId: number): Promise<ReturnData> {
    const profileResponse = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_profile/${userId}`);
    const settingsResponse = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_settings/user/${userId}`);

    if (profileResponse.status !== 200 || settingsResponse.status !== 200) {
        throw new Error("What the Bingus? Error while fetching page data.");
    }

    const profile: UserProfile = await profileResponse.json();
    const settings: UserSettings = await settingsResponse.json();

    return { profile, settings };
}