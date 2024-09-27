// api/post_vote
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM post_vote");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { post_id, user_id, vote_value } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO post_vote (post_id, user_id, vote_value) VALUES ($1, $2, $3) RETURNING *",
            [post_id, user_id, vote_value]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { post_vote_id, post_id, user_id, vote_value } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE post_vote SET post_id = $2, user_id = $3, vote_value = $4 WHERE post_vote_id = $1 RETURNING *",
            [post_vote_id, post_id, user_id, vote_value]
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
        const result = await client.query("DELETE FROM post_vote WHERE post_vote_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify({ message: "Vote deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
