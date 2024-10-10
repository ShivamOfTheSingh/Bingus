import pool from "../lib/pool";
import { ChatSettings } from "../lib/models";

export async function GET(): Promise<ChatSettings[] | string> {
    let client; 
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM chat_settings");
        const chatSettings: ChatSettings[] = result.rows.map((row: any) => (
            {
                chatSettingsId: row.chat_settings_id,
                chatId: row.chat_id,
                mute: row.mute,
                notifications: row.notifications,
                chatPic: row.chat_pic
            }
        ));
        return chatSettings;
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function GET_BY_ID(id: number): Promise<ChatSettings | string> {
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query("SELECT * FROM chat_settings WHERE chat_settings_id = $1", [id]);

        if (result.rows.length === 0) { 
            return "No chat settings found.";
        }

        const chatSettings: ChatSettings = {
            chatSettingsId: result.rows[0].chat_settings_id,
            chatId: result.rows[0].chat_id,
            mute: result.rows[0].mute,
            notifications: result.rows[0].notifications,
            chatPic: result.rows[0].chat_pic
        };

        return chatSettings;
    }
    catch (error) {
        return "An error occured.";
    } 
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function POST(chatSettings: ChatSettings): Promise<string> {
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO chat_settings (chat_id, mute, notifications, chat_pic) VALUES ($1, $2, $3, $4) RETURNING chat_settings_id",
            [chatSettings.chatId, chatSettings.mute, chatSettings.notifications, chatSettings.chatPic]
        );
        const id = result.rows[0].chat_settings_id;
        return id;
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function PUT(chatSettings: ChatSettings): Promise<string> {
    let client;
    try {
        client = await pool.connect();
        await client.query(
            "UPDATE chat_settings SET chat_id = $2, mute = $3, notifications = $4, chat_pic = $5 WHERE chat_settings = $1",
            [chatSettings.chatSettingsId, chatSettings.chatId, chatSettings.mute, chatSettings.notifications, chatSettings.chatPic]
        );
        return "OK";
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function DELETE(id: number): Promise<string> {
    let client; 
    try { 
        client = await pool.connect();
        await client.query("DELETE FROM chat_settings WHERE chat_settings_id = $1", [id]);

        return "OK";
    }
    catch (error) {
        return "An error occured";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}