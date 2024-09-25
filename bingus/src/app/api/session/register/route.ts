import { UserAuth } from "@/lib/models";
import bcrypt from "bcrypt";
import pg from "pg";
const { Pool } = pg;

/**
 * Registers a user with an encrypted password.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response. 
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        // Get data from request body
        const userAuth: UserAuth = await request.json();

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(userAuth.password, 10);

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
        client = await pool.connect();
        // Check if user already exists
        const userExistsResult = await client.query(`SELECT * FROM user_auth WHERE user_id = '${userAuth.userId}'`);
        if (userExistsResult.rows.length > 0) {
            return new Response("User already exists", { status: 409 });
        }
        else {
            await client.query(`
                INSERT INTO user_auth
                (
                    user_password,
                    date_registered,
                    user_id
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
            `, [encryptedPassword, userAuth.dateRegistered, userAuth.userId]);
            return new Response("User successfully registered", { status: 201 });
        }
    }
    catch (error: any) {
        return new Response("Internal Server Error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}