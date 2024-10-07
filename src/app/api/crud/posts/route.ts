import { Post } from "@/lib/db/models";
import pool from "@/lib/db/pool";
import getCurrentSession from "@/lib/cookies/getCurrentSession";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * GET endpoint for table posts (Fetch all posts)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Post objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM posts");
        const posts: Post[] = result.rows.map((row: any) => (
            {
                postId: row.post_id,
                userId: row.user_id,
                caption: row.caption,
                datePosted: new Date(row.date_posted)  // Convert to Date object
            }
        ));
        return new Response(JSON.stringify(posts), { status: 200 });
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
 * POST endpoint for table posts (Create a new post)
 * 
 * @param {Request} request The incoming HTTP request with Post object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    const userId = await getCurrentSession();
    try {
        const post: Post = await request.json();
        post.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO posts (user_id, caption, date_posted) VALUES ($1, $2, $3) RETURNING post_id",
            [post.userId, post.caption, post.datePosted]
        );
        const id = result.rows[0].post_id;
        return new Response(JSON.stringify({ postId: id }), { status: 201 });
    }
    catch (error) {
        console.log(error);
        return new Response("Failed to create data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * PUT endpoint for table posts (Update an existing post)
 * 
 * @param {Request} request The incoming HTTP request with Post object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    const userId = await getCurrentSession();
    try {
        const post: Post = await request.json();
        post.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE posts SET user_id = $2, caption = $3, date_posted = $4 WHERE post_id = $1",
            [post.postId, post.userId, post.caption, post.datePosted]
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
 * DELETE endpoint for table posts (Delete a post by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the post to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM posts WHERE post_id = $1", [id]);

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
