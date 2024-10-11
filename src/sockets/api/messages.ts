import { Message } from "../lib/models";
import pool from "../lib/pool";

export async function GET(): Promise<Message[] | string> { 
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query("SELECT * FROM messages");
        const messages: Message[] = result.rows.map((row: any) => (
            {
                messageId: row.messages_id,
                chatId: row.chat_id,
                userId: row.user_id,
                messageText: row.messages_text,
                messageTime: row.messages_timestamp
            }
        ));
        return messages;
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

export async function GET_BY_ID(id: number): Promise<Message | string> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM messages WHERE messages_id = $1", [id]);

        if (result.rows.length === 0) {
            return "No messages found";
        }

        const message: Message = {
            messageId: result.rows[0].messages_id,
            chatId: result.rows[0].chat_id,
            userId: result.rows[0].user_id,
            messageText: result.rows[0].messages_text,
            messageTime: result.rows[0].messages_timestamp
        };

        return message;
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

export async function POST(message: Message): Promise<string> { 
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO messages (chat_id, user_id, messages_text, messages_timestamp) VALUES ($1, $2, $3, $4) RETURNING messages_id",
            [message.chatId, message.userId, message.messageText, message.messageTime]
        );
        const id = result.rows[0].messages_id;
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

export async function PUT(message: Message): Promise<string> {
    let client; 
    try { 
        client = await pool.connect();
        await client.query(
            "UPDATE messages SET chat_id = $2, user_id = $3, messages_text = $4, messages_timestamp = $5 WHERE messages_id = $1",
            [message.messageId, message.chatId, message.userId, message.messageText, message.messageTime]
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
        await client.query("DELETE FROM messages WHERE messages_id = $1", [id]);
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