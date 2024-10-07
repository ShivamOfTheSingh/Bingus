import { cookies } from "next/headers";
import pool from "./pool";
import { decrypt } from "./objectEncryption";
import { redirect } from "next/navigation";

/**
 * Gets the ID of the currently logged in user or redirects to session expired page
 * 
 * @returns {number} The user ID of the currently loggged in user.
 */
export default async function getCurrentSession(): Promise<number> {
    let client;
    try {
        const session = cookies().get("session");
        client = await pool.connect();
        if (session) {
            const sessionJson = JSON.parse(decrypt(session.value));
            const result = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthid]);
            const userId = result.rows[0].user_id;
            client.release();
            return userId;
        }
        else {
            client.release();
            redirect("/");
        }
    }
    catch (error) {
        if (client) {
            client.release();
        }
        redirect("/");
    }
}