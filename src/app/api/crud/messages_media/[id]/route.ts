import { MessagesMedia } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table messages_media - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(reqeuest: Request, {params}: {params: { id: string }}): Promise<Response> {
    let client; 
    try { 
        const id = parseInt(params.id);
        client = await pool.connect(); 
        const result = await client.query("SELECT * FROM messages_media WHERE messages_media_id = $1", [id]);

        if (result.rows.length === 0) { 
            return new Response("Message Media record not found", { status: 404 });
        }

        const messagesMedia: MessagesMedia = { 
            messagesMediaId: result.rows[0].message_media_id,
            messagesId: result.rows[0].messages_id,
            messagesMedia: result.rows[0].mime_type_prefix + Buffer.from(result.rows[0].messages_media, 'base64').toString('base64')
        };

        return new Response(JSON.stringify(messagesMedia), { status: 200 });
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