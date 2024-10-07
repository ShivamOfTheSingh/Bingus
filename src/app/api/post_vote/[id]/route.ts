import { PostVote } from "@/lib/models";
import pool from "../../../../lib/pool";

/**
 * GET endpoint for table post_vote - single row by id
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
        const result = await client.query("SELECT * FROM post_vote WHERE post_likes_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Post vote record not found", { status: 404 });
        }

        const postVote: PostVote = {
            postVoteId: result.rows[0].post_likes_id,
            postId: result.rows[0].post_id,
            userId: result.rows[0].user_id,
            postVoteValue: result.rows[0].post_vote_value
        };
        return new Response(JSON.stringify(postVote), { status: 200 });
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
