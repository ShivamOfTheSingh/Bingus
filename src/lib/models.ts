export interface UserProfile {
    userId?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    about?: string;
    profilePicture?: string;
}

export interface UserAuth {
    userAuthId?: number;
    password: string;
    dateRegistered: Date;
    userId: number;
}

export interface UserSession {
    sessionId?: number;
    publicSessionId: string;
    expiresAt: Date;
    userAuthId: number;
    logoutAt?: Date;
}

export interface Post {
    postId?: number;
    userId?: number;
    caption: string;
    datePosted: Date;
}

export interface Media {
    mediaId?: number;
    postId: number;
    mediaUrl: string;
}

export interface CommentReply {
    commentReplyId?: number;
    postCommentId: number;
    userId: number;
    reply: string;
    dateReplied: Date;
}

export interface CommentVote {
    commentVoteId?: number;
    postCommentId: number;
    userId: number;
    commentVoteValue: boolean;
}

export interface Following {
    followingId?: number;
    userId: number;
    followedUserId: number;
}

export interface PostComment {
    postCommentId?: number;
    postId: number;
    userId: number;
    postComment: string;
    dateCommented: Date;
}

export interface PostVote {
    postVoteId?: number;
    postId: number;
    userId: number;
    postVoteValue: boolean;
}

export interface UserSettings {
    userSettingsId?: number;
    userId: number;
    showName: boolean;
    profilePublic: boolean;
}

