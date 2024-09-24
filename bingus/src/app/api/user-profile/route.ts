import { UserProfile } from "@/lib/models";
import pg from "pg";
const { Pool } = pg;

/**
 * Creates a new user profile in the database.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response with appropriate status.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        // Get user profile from HTTP request data
        const userProfile: UserProfile = await request.json();

        // Register DB
        const pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: 5432,
            database: process.env.DB_NAME,
            ssl: {
                rejectUnauthorized: false
            }
        });

        // Open DB connection
        const client = await pool.connect();
        // Check if user already exists
        const userExistsResult = await client.query(`SELECT * FROM user_profile WHERE user_name = '${userProfile.username}' OR email = '${userProfile.email}'`);
        if (userExistsResult.rows.length > 0) {
            return new Response("User already exists", { status: 409 });
        }
        else {
            await client.query(`
                INSERT INTO user_profile
                (
                    user_name,
                    email,
                    first_name,
                    last_name,
                    gender,
                    birth_date
                )
                VALUES
                (
                    '${userProfile.username}',
                    '${userProfile.email}',
                    '${userProfile.firstName}',
                    '${userProfile.lastName}',
                    '${userProfile.gender}',
                    '${userProfile.birthDate}'
                )
            `);
            // Get user ID to return
            const userIdResult = await client.query(`SELECT user_id FROM user_profile WHERE user_name = '${userProfile.username}'`);
            const userId = userIdResult.rows[0].user_id;
            // Return newly created user ID
            return Response.json({ userId: userId }, { status: 201 });
        }
    }
    catch (error: any) {
        console.log(error);
        return new Response("Error while creating user profile.", { status: 500 });
    }
}