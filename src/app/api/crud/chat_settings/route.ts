import { ChatSettings } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table chat_settings (Fetch all chat_settings)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of ChatSettings objects or an error code
 */

export async function GET(request: Request): Promise<Response> {
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
        return new Response(JSON.stringify(chatSettings), { status: 200 })
    }
    catch (error) {
        return new Response("Failed to fetch data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * POST endpoint for table chat_settings (Create new chat settings)
 * 
 * @param {Request} request The incoming HTTP request with UserSettings object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const chatSettings: ChatSettings = await request.json();
        chatSettings.chatId = userId; 
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO chat_settings (chat_id, mute, notifications, chat_pic) VALUES ($1, $2, $3, $4) RETURNING chat_settings_id",
            [chatSettings.chatId, chatSettings.mute, chatSettings.notifications, chatSettings.chatPic]
        );
        const id = result.rows[0].chat_settings_id;
        return new Response(JSON.stringify({ chatSettingsId: id }), { status: 201 });
    }
    catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * PUT endpoint for table chat_settings (Update existing chat settings)
 * 
 * @param {Request} request The incoming HTTP request with ChatSettings object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const chatSettings: ChatSettings = await request.json();
        chatSettings.chatId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE chat_settings SET chat_id = $2, mute = $3, notifications = $4, chat_pic = $5 WHERE chat_settings = $1",
            [chatSettings.chatSettingsId, chatSettings.chatId, chatSettings.mute, chatSettings.notifications, chatSettings.chatPic]
        );
        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * DELETE endpoint for table user_settings (Delete user settings by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the user settings to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client; 
    try { 
        const { id } = await request.json();
        const userId = await getCurrentSessionUserId();
        if (userId === -1 || userId !== id) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        client = await pool.connect();
        await client.query("DELETE FROM chat_settings WHERE chat_settings_id = $1", [id]);

        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}