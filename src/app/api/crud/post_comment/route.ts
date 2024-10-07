import { PostComment } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSession from "@/lib/cookies/getCurrentSession";
import { NextResponse } from "next/server";

/**
 * GET endpoint for table post_comment (Fetch all post comments)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of PostComment objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM post_comment");
        const postComments: PostComment[] = result.rows.map((row: any) => (
            {
                postCommentId: row.post_comment_id,
                postId: row.post_id,
                userId: row.user_id,
                postComment: row.post_comment,
                dateCommented: new Date(row.date_commented),  // Convert to Date object
            }
        ));
        return new Response(JSON.stringify(postComments), { status: 200 });
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
 * POST endpoint for table post_comment (Create a new post comment)
 * 
 * @param {Request} request The incoming HTTP request with PostComment object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    const userId = await getCurrentSession();
    try {
        const postComment: PostComment = await request.json();
        postComment.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO post_comment (post_id, user_id, post_comment, date_commented) VALUES ($1, $2, $3, $4) RETURNING post_comment_id",
            [postComment.postId, postComment.userId, postComment.postComment, postComment.dateCommented]
        );
        const id = result.rows[0].post_comment_id;
        return new Response(JSON.stringify({ postCommentId: id }), { status: 201 });
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
 * PUT endpoint for table post_comment (Update an existing post comment)
 * 
 * @param {Request} request The incoming HTTP request with PostComment object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    const userId = await getCurrentSession();
    try {
        const postComment: PostComment = await request.json();
        postComment.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE post_comment SET post_id = $2, user_id = $3, post_comment = $4, date_commented = $5 WHERE post_comment_id = $1",
            [postComment.postCommentId, postComment.postId, postComment.userId, postComment.postComment, postComment.dateCommented]
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
 * DELETE endpoint for table post_comment (Delete a post comment by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the post comment to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM post_comment WHERE post_comment_id = $1", [id]);

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
