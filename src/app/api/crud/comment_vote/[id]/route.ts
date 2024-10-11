import { CommentVote } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table comment_vote - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_vote WHERE comment_vote_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Comment vote not found", { status: 404 });
        }

        const commentVote: CommentVote = {
            commentVoteId: result.rows[0].comment_vote_id,
            postCommentId: result.rows[0].post_comment_id,
            userId: result.rows[0].user_id,
            commentVoteValue: result.rows[0].comment_vote_value
        };
        return new Response(JSON.stringify(commentVote), { status: 200 });
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
