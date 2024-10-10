import { ChatSettings } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table user_settings - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */

export async function GET(request: Request, { params }: { params: {id: string }}): Promise<Response> {
    let client; 
    try { 
        const id = parseInt(params.id); 
        client = await pool.connect(); 
        const result = await client.query("SELECT * FROM chat_settings WHERE chat_settings_id = $1", [id]);

        if (result.rows.length === 0) { 
            return new Response("Chat settings record not found", { status: 404 });
        }

        const chatSettings: ChatSettings = {
            chatSettingsId: result.rows[0].chat_settings_id,
            chatId: result.rows[0].chat_id,
            mute: result.rows[0].mute,
            notifications: result.rows[0].notifications,
            chatPic: result.rows[0].chat_pic
        };
        return new Response(JSON.stringify(chatSettings), { status: 200 });
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