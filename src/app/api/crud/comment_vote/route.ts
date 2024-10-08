import { CommentVote } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table comment_vote
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an error code or an array of CommentVote objects
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_vote");
        const commentVotes: CommentVote[] = result.rows.map((row: any) => (
            {
                commentVoteId: row.comment_vote_id,
                postCommentId: row.post_comment_id,
                userId: row.user_id,
                commentVoteValue: row.comment_vote_value
            }
        ));
        return new Response(JSON.stringify(commentVotes), { status: 200 });
    }
    catch (error) {
        return new Response("Failed to fetch data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * POST endpoint for table comment_vote
 * 
 * @param {Request} request The incoming HTTP request with CommentVote object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const commentVote: CommentVote = await request.json();
        commentVote.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO comment_vote (post_comment_id, user_id, comment_vote_value) VALUES ($1, $2, $3) RETURNING comment_vote_id",
            [commentVote.postCommentId, commentVote.userId, commentVote.commentVoteValue]
        );
        const id = result.rows[0].comment_vote_id;
        return new Response(JSON.stringify({ commentVoteId: id }), { status: 201 });
    }
    catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * PUT endpoint for table comment_vote
 * 
 * @param {Request} request The incoming HTTP request with CommentVote object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const commentVote: CommentVote = await request.json();
        commentVote.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE comment_vote SET post_comment_id = $2, user_id = $3, comment_vote_value = $4 WHERE comment_vote_id = $1",
            [commentVote.commentVoteId, commentVote.postCommentId, commentVote.userId, commentVote.commentVoteValue]
        );

        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * DELETE endpoint for table comment_vote
 * 
 * @param {Request} request The incoming HTTP request containing the id of the commentVote to be deleted
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        const userId = await getCurrentSessionUserId();
        if (userId === -1 || userId !== id) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        client = await pool.connect();
        await client.query("DELETE FROM comment_vote WHERE comment_vote_id = $1", [id]);

        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
