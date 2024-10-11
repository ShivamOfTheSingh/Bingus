import { UserSettings } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table user_settings (Fetch all user settings)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of UserSettings objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_settings");
        const userSettings: UserSettings[] = result.rows.map((row: any) => (
            {
                userSettingsId: row.user_settings_id,
                userId: row.user_id,
                showName: row.show_name,
                profilePublic: row.profile_public
            }
        ));
        return new Response(JSON.stringify(userSettings), { status: 200 });
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
 * POST endpoint for table user_settings (Create new user settings)
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
        const userSettings: UserSettings = await request.json();
        userSettings.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO user_settings (user_id, show_name, profile_public) VALUES ($1, $2, $3) RETURNING user_settings_id",
            [userSettings.userId, userSettings.showName, userSettings.profilePublic]
        );
        const id = result.rows[0].user_settings_id;
        return new Response(JSON.stringify({ userSettingsId: id }), { status: 201 });
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
 * PUT endpoint for table user_settings (Update existing user settings)
 * 
 * @param {Request} request The incoming HTTP request with UserSettings object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const userSettings: UserSettings = await request.json();
        userSettings.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE user_settings SET user_id = $2, show_name = $3, profile_public = $4 WHERE user_settings_id = $1",
            [userSettings.userSettingsId, userSettings.userId, userSettings.showName, userSettings.profilePublic]
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
        await client.query("DELETE FROM user_settings WHERE user_settings_id = $1", [id]);

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
