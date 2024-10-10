import pool from "./pool";
import { Message } from "./models";

export default async function storeMessage(message: Message) {
    let client;
    try {
        client = await pool.connect();
        await client.query("INSERT INTO messages (chat_id, user_id, messages_text, messages_timestamp) VALUES ($1, $2, $3, $4)",
            [message.chatId, message.userId, message.messageText, message.messageTime]);
    }
    catch (error: any) {
        console.log("Error storing message", error.message)
    }
    finally {
        if (client) {
            client.release();
        }
    }
}