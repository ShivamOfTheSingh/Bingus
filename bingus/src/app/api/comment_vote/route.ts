// api/comment_vote
import { NextRequest } from "next/server";
import pool from "../pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_vote");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { post_comment_id, user_id, comment_vote_value } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO comment_vote (post_comment_id, user_id, comment_vote_value) VALUES ($1, $2, $3) RETURNING *",
            [post_comment_id, user_id, comment_vote_value]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { comment_vote_id, post_comment_id, user_id, comment_vote_value } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE comment_vote SET post_comment_id = $2, user_id = $3, comment_vote_value = $4 WHERE comment_vote_id = $1 RETURNING *",
            [comment_vote_id, post_comment_id, user_id, comment_vote_value]
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
        const result = await client.query("DELETE FROM comment_vote WHERE comment_vote_id=$1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
