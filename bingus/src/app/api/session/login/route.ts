import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/objectEncryption";
import pool from "../../../../lib/pool";

/**
 * Login as an existing user and create a user session.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response. 
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userData = await request.json();
        client = await pool.connect();
        const result = await client.query(`SELECT up.email, ua.user_password, ua.user_auth_id
                                            FROM user_profile AS up
                                            INNER JOIN user_auth AS ua
                                            ON up.user_id = ua.user_id
                                            WHERE up.email = $1`,
            [userData.email]
        );

        if (result.rows.length > 0) {
            const passwordMatches = await bcrypt.compare(userData.password, result.rows[0].user_password);
            if (passwordMatches) {
                const sessionCreated = await createSession(result.rows[0].user_auth_id);
                if (sessionCreated) {
                    return new Response("Logged in", { status: 200 });
                }
                else {
                    return new Response("Error creating session", { status: 500 });
                }
            }
            else {
                return new Response("Invalid email/password", { status: 401 });
            }
        }
        else {
            return new Response("Invalid email/password", { status: 404 });
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

async function createSession(userAuthId: number): Promise<boolean> {
    let client;
    try {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expire after 1 day
        client = await pool.connect();
        const result = await client.query(`
                INSERT INTO user_session
                (
                    expires_at,
                    user_auth_id
                )
                VALUES
                (
                    $1,
                    $2
                ) RETURNING public_session_id
            `, [expiresAt, userAuthId]);

        const session = JSON.stringify({sessionId: result.rows[0].public_session_id, userAuthId: userAuthId});
        const encryptedSession = encrypt(session);

        cookies().set("session", encryptedSession, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            path: "/"
        });
        return true;
    }
    catch (error: any) {
        console.log(error);
        return false;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}