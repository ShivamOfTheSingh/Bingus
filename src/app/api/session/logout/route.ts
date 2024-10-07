import { cookies } from "next/headers";
import { decrypt } from "@/lib/utils/objectEncryption";
import pool from "../../../../lib/db/pool";

export async function PATCH(request: Request): Promise<Response> {
    let client;
    try {
        const currentSession = cookies().get("session")?.value;
        if (currentSession){
            const decryptedSession = JSON.parse(decrypt(currentSession));
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
                return new Response("Database session not found", { status: 404 });
            }
        }
        else {
            return new Response("Browser session not found", { status: 404 });
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