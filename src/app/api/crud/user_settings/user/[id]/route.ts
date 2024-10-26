import pool from "@/lib/db/pool";
import { UserSettings } from "@/lib/db/models";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_settings WHERE user_id = $1", [params.id]);

        if (result.rows.length === 0) {
            return new Response("User settings not found", { status: 404 });
        }

        const userSettings: UserSettings = {
            userSettingsId: result.rows[0].user_settings_id,
            userId: result.rows[0].user_id,
            showName: result.rows[0].show_name,
            profilePublic: result.rows[0].profile_public
        };
        return new Response(JSON.stringify(userSettings), { status: 200 });
    }
    catch (error: any) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}