import pool from "@/lib/db/pool";
import { CommentVote } from "@/lib/db/models";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
    let client;
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get("userId");
        const postCommentId = searchParams.get("postCommentId");

        client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_vote WHERE user_id = $1 AND post_comment_id = $2", [userId, postCommentId]);

        if (result.rows.length === 0) {
            return new Response("Not found", { status: 404 });
        }

        const commentVote: CommentVote = {
            commentVoteId: result.rows[0].comment_vote_id,
            postCommentId: result.rows[0].post_comment_id,
            userId: result.rows[0].user_id
        };

        return new Response(JSON.stringify(commentVote), { status: 200 });
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