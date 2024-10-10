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

export interface MessagesMedia {
    messagesMediaId?: number; 
    messagesId: number; 
    messagesMedia: string; 
}

export interface Chat {
    chatId?: number;
    chatName: string;
}

export interface ChatSettings {
    chatSettingsId?: number; 
    chatId: number;
    mute: boolean;
    notifications: boolean; 
    chatPic?: string;  
}

export interface GroupMembers {
    groupMemberId?: number; 
    userId: number;
    chatId: number; 
}