import { UserAuth } from "@/lib/db/models";
import bcrypt from "bcrypt";
import pool from "../../../../lib/db/pool";

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
        console.log(userAuth);

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(userAuth.password, 10);

        // Open DB connection
        client = await pool.connect();
        // Check if user already exists
        const userExistsResult = await client.query("SELECT * FROM user_auth WHERE user_id = $1", [userAuth.userId]);
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