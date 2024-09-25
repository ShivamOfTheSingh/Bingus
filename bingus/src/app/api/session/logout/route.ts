import { cookies } from "next/headers";
import { decrypt } from "@/lib/objectEncryption";
import pg from "pg";
const { Pool } = pg;

export async function PATCH(request: Request): Promise<Response> {
    let client;
    try {
        const currentSession = cookies().get("session")?.value;
        if (currentSession){
            const decryptedSession = JSON.parse(decrypt(currentSession));
            
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
            client = await pool.connect();

            const selectResult = await client.query(`
                SELECT session_id FROM user_session
                WHERE public_session_id = $1
            `, [decryptedSession.sessionId]);
            
            if (selectResult.rows.length > 0) {
                const sessionId = selectResult.rows[0].session_id;
                const now = new Date(Date.now());
                await client.query(`
                    UPDATE user_session
                    SET logout_at = $1
                    WHERE session_id = $2 
                `, [now, sessionId]);
                
                cookies().set("session", currentSession, { maxAge: 0 });
                return new Response("Logged out", { status: 200 });
            }
            else {
                return new Response("Session not found in database", { status: 404 });
            }
        }
        else {
            return new Response("Session not found", { status: 404 });
        }
    }
    catch (error: any) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}