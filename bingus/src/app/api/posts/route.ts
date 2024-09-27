// api/posts
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM posts");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user_id, title, caption, date_posted } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO posts (user_id, title, caption, date_posted) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, title, caption, date_posted]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { post_id, user_id, title, caption, date_posted } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE posts SET user_id = $2, title = $3, caption = $4, date_posted = $5 WHERE post_id = $1 RETURNING *",
            [post_id, user_id, title, caption, date_posted]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 200 });
    } catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const client = await pool.connect();
        const result = await client.query("DELETE FROM posts WHERE post_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify({ message: "Post deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
