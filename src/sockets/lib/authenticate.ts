import pool from "./pool";
import { UserSession } from "./models";
import decrypt from "./decrypt";

export default async function authenticate(encryptedSession: string): Promise<boolean> {
    let client;
    try {
        const decryptedSession: UserSession = JSON.parse(decrypt(encryptedSession));
        client = await pool.connect();
        const result = await client.query("SELECT * FROM user_auth AS ua INNER JOIN user_session AS us ON ua.user_auth_id = us.user_auth_id WHERE us.public_session_id = $1 AND ua.user_auth_id = $2",
                                        [decryptedSession.sessionId, decryptedSession.userAuthId]);
        if (result.rows.length > 0) {
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}