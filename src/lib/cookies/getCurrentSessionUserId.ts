import { cookies } from "next/headers";
import pool from "../db/pool";
import { decrypt } from "../utils/objectEncryption";

/**
 * Gets the ID of the currently logged in user or redirects to session expired page
 * 
 * @returns {number} The user ID of the currently loggged in user.
 */
export default async function getCurrentSessionUserId(): Promise<number> {
    console.log("Beginning of function");
    const session = cookies().get("session");
    console.log("after getting session cookie");
    if (!session) {
        return -1;
    }
    console.log("before db connect");
    const client = await pool.connect();
    console.log("before decrypt");
    const sessionJson = JSON.parse(decrypt(session.value));
    console.log("after decrypt");
    const result = await client.query("SELECT user_id FROM user_auth WHERE user_auth_id = $1", [sessionJson.userAuthId]);
    console.log("after query");
    const userId = result.rows[0].user_id;
    client.release();
    console.log("before return, userID:", userId);
    return userId;
}
