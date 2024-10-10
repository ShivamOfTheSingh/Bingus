import { Chat } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table chat - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */

export async function GET(request: Request, { params }: { params: { id: string }}): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        
        const result = await client.query("SELECT * FROM chat WHERE chat_id = $1", [id]);
        
        if (result.rows.length === 0) {
            return new Response("Chat record not found", { status: 404 });
        }

        const chat: Chat = {
            chatId: result.rows[0].chat_id,
            chatName: result.rows[0].chat_name
        };

        return new Response(JSON.stringify(chat), { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new Response("Failed to retrieve data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

