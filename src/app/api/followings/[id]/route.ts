import { Following } from "@/lib/models";
import pool from "../../../../lib/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM followings WHERE following_status_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Following record not found", { status: 404 });
        }

        const following: Following = {
            followingId: result.rows[0].following_status_id,
            userId: result.rows[0].user_id,
            followedUserId: result.rows[0].following_id
        };
        return new Response(JSON.stringify(following), { status: 200 });
    } 
    catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}