import { Messages } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table messages - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, {params} : {params: {id: string}}): Promise<Response> {
    let client; 
    try { 
        const id = parseInt(params.id);
        client = await pool.connect(); 
        const result = await client.query("SELECT * FROM messages WHERE messages_id = $1", [id]);

        if (result.rows.length === 0) { 
            return new Response("Message record not found", { status: 404 });
        }

        const messages: Messages = { 
            messagesId: result.rows[0].messages_id,
            chatId: result.rows[0].chat_id,
            userId: result.rows[0].user_id,
            messagesText: result.rows[0].messages_text,
            messagesTimestamp: result.rows[0].messages_timestamp
        };
        return new Response(JSON.stringify(messages), { status: 200 });
    }
    catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
