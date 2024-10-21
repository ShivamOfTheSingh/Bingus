import pool from "@/lib/db/pool";
import { Following } from "@/lib/db/models";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM followings WHERE user_id = $1", [params.id]);
        const followings: Following[] = result.rows.map((row: any) => {
            return {
                followingId: row.followings_status_id,
                userId: row.user_id,
                followedUserId: row.following_id
            };
        });
        return new Response(JSON.stringify(followings), { status: 200 })
    }
    catch (error: any) {
        return new Response("Internal Server Error", { status: 500 })
    }
    finally{
        if (client) {
            client.release();
        }
    }
}