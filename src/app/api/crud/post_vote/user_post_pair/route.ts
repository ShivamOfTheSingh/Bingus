import pool from "@/lib/db/pool";
import { PostVote } from "@/lib/db/models";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    let client;
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get("userId");
        const postId = searchParams.get("postId");

        client = await pool.connect();
        const result = await client.query("SELECT * FROM post_vote WHERE user_id = $1 AND post_id = $2", [userId, postId]);

        if (result.rows.length === 0) {
            return new Response("Not found", { status: 404 });
        }

        const postVote: PostVote = {
            postVoteId: result.rows[0].post_likes_id,
            postId: result.rows[0].post_id,
            userId: result.rows[0].user_id
        };

        return new Response(JSON.stringify(postVote), { status: 200 });
    }
    catch (error: any) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}