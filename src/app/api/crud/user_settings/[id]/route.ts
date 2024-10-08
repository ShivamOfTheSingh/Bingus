import { UserSettings } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table user_settings - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_settings WHERE user_settings_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("User settings record not found", { status: 404 });
        }

        const userSettings: UserSettings = {
            userSettingsId: result.rows[0].user_settings_id,
            userId: result.rows[0].user_id,
            showName: result.rows[0].show_name,
            profilePublic: result.rows[0].profile_public
        };
        return new Response(JSON.stringify(userSettings), { status: 200 });
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
