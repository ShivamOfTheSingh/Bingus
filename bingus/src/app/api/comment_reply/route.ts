// api/comment_reply
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_reply");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { post_comment_id, user_id, reply, date_replied } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO comment_reply (post_comment_id, user_id, reply, date_replied) VALUES ($1, $2, $3, $4)", 
            [post_comment_id, user_id, reply, date_replied]
        );
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { comment_reply_id, post_comment_id, user_id, reply, date_replied } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE comment_reply SET post_comment_id = $2, user_id = $3, reply = $4, date_replied = $5 WHERE comment_reply_id = $1", 
            [comment_reply_id, post_comment_id, user_id, reply, date_replied]
        );
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const client = await pool.connect();
        const result = await client.query("DELETE FROM comment_reply WHERE comment_reply_id=$1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
