import { UserProfile } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";

/**
 * GET endpoint for table user_profile - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        console.log("Hello from user profile endpoint");
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_profile WHERE user_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("User profile record not found", { status: 404 });
        }

        const userProfile: UserProfile = {
                userId: result.rows[0].user_id,
                username: result.rows[0].user_name,
                email: result.rows[0].email,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name,
                gender: result.rows[0].gender,
                birthDate: new Date(result.rows[0].birth_date),
                about: result.rows[0].about,
                profilePicture: result.rows[0].profile_pic ? result.rows[0].pic_mime_type_prefix + Buffer.from(result.rows[0].profile_pic, 'base64').toString('base64') : ""
        };

        return new Response(JSON.stringify(userProfile), { status: 200 });
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
