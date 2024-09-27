export interface UserProfile {
    userId?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    about?: string;
    profilePicutre?: Blob;
}

export interface UserAuth {
    userAuthId?: number;
    password: string;
    dateRegistered: string;
    userId: number;
}