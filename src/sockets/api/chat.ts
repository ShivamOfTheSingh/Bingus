import pool from "../lib/pool";
import { Chat } from "../lib/models";

export async function GET(): Promise<Chat[] | string> {
    let client; 
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM chat");
        const chat: Chat[] = result.rows.map((row: any) => (
            {
                chatId: row.chat_id,
                chatName: row.chat_name
            }
        ));
        return chat;
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

export async function GET_BY_ID(id: number): Promise<Chat | string> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM chat WHERE chat_id = $1", [id]);
        
        if (result.rows.length === 0) {
            return "No chats found.";
        }

        const chat: Chat = {
            chatId: result.rows[0].chat_id,
            chatName: result.rows[0].chat_name
        };

        return chat;
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

export async function POST(chat: Chat): Promise<string> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO chat (chat_name) VALUES ($1) RETURNING chat_id",
            [chat.chatName]
        );
        const id = result.rows[0].chat_id;
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

export async function PUT(chat: Chat): Promise<string> {
    let client; 
    try { 
        client = await pool.connect();
        await client.query(
            "UPDATE chat SET chat_name = $1 WHERE chat_id = $2",
            [chat.chatName]
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
        await client.query("DELETE FROM chat WHERE chat_id = $1", [id]);

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