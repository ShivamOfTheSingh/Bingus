import { cookies } from "next/headers";
import pool from "../db/pool";
import { decrypt } from "../utils/objectEncryption";
import { redirect } from "next/navigation";

/**
 * Gets the ID of the currently logged in user or redirects to session expired page
 * 
 * @returns {number} The user ID of the currently loggged in user.
 */
export default async function getCurrentSession(): Promise<number> {
    const session = cookies().get("session");
    if (!session) {
        redirect("/session_inactive");
    }
    const client = await pool.connect();
    const sessionJson = JSON.parse(decrypt(session.value));
    const result = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthId]);
    const userId = result.rows[0].user_id;
    client.release();
    return userId;
}