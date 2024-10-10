import pool from "./pool";
import { Message } from "./models";

export default async function loadMessages(): Promise<Message[] | string> {
    let client;
    try {
        throw new Error();
        client = await pool.connect();
        const result = await client.query("SELECT * FROM messages");
        const messages: Message[] = result.rows.map((row: any) => {
            return {
                messageId: row.messages_id,
                chatId: row.chat_id,
                userId: row.user_id,
                messageText: row.messages_text,
                messageTime: row.messages_timestamp
            };
        });
        return messages;
    }
    catch (error) {
        return "An error occured";
    }
    finally {
        if (client) {
            // client.release();
        }
    }
}