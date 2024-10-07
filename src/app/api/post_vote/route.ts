import { PostVote } from "@/lib/models";
import pool from "../../../lib/pool";

/**
 * GET endpoint for table post_vote (Fetch all post votes)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of PostVote objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM post_vote");
        const postVotes: PostVote[] = result.rows.map((row: any) => (
            {
                postVoteId: row.post_likes_id,
                postId: row.post_id,
                userId: row.user_id,
                postVoteValue: row.post_vote_value
            }
        ));
        return new Response(JSON.stringify(postVotes), { status: 200 });
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
 * POST endpoint for table post_vote (Create a new post vote)
 * 
 * @param {Request} request The incoming HTTP request with PostVote object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const postVote: PostVote = await request.json();
        client = await pool.connect();
        await client.query(
            "INSERT INTO post_vote (post_id, user_id, post_vote_value) VALUES ($1, $2, $3)", 
            [postVote.postId, postVote.userId, postVote.postVoteValue]
        );
        return new Response("OK", { status: 201 });
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
 * PUT endpoint for table post_vote (Update an existing post vote)
 * 
 * @param {Request} request The incoming HTTP request with PostVote object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const postVote: PostVote = await request.json();
        client = await pool.connect();
        await client.query(
            "UPDATE post_vote SET post_id = $2, user_id = $3, post_vote_value = $4 WHERE post_likes_id = $1", 
            [postVote.postVoteId, postVote.postId, postVote.userId, postVote.postVoteValue]
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
 * DELETE endpoint for table post_vote (Delete a post vote by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the post vote to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM post_vote WHERE post_likes_id = $1", [id]);

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
