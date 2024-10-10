export interface UserSession {
    sessionId: string;
    userAuthId: number;
}

export interface Message {
    messageId?: number;
    chatId?: number;
    userId: number;
    messageText: string;
    messageTime: Date;
}