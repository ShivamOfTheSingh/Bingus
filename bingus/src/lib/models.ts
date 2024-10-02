export interface UserProfile {
    userId?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    about?: string;
    profilePicture?: Blob;
}

export interface UserAuth {
    userAuthId?: number;
    password: string;
    dateRegistered: string;
    userId: number;
}

export interface Post {
    postId?: number;
    userId?: number;
    caption: string;
    datePosted: string;
}

export interface Media{
    mediaId?: number;
    postId: number;
    mediaUrl: Buffer;
}