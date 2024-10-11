import pool from "./pool";
import { UserSession } from "./models";
import decrypt from "./decrypt";

export default async function authenticate(encryptedSession: string): Promise<number> {
    let client;
    try {
        console.log("Decrypted session: ", decrypt(encryptedSession));
        console.log(JSON.parse(decrypt(encryptedSession)));
        const decryptedSession: UserSession = JSON.parse(decrypt(encryptedSession));
        client = await pool.connect();
        const result = await client.query("SELECT ua.user_id FROM user_auth AS ua INNER JOIN user_session AS us ON ua.user_auth_id = us.user_auth_id WHERE us.public_session_id = $1 AND ua.user_auth_id = $2",
                                        [decryptedSession.sessionId, decryptedSession.userAuthId]);
        const userId = result.rows[0].user_id;
        if (userId) {
            return parseInt(userId);
        }
        return -1;
    }
    catch (error) {
        return -1;
    }
    finally {
        if (client) {
            client.release();
        }
    }
}