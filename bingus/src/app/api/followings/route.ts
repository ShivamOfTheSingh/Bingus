// api/followings
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM followings");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user_id, following_id } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO followings (user_id, following_id) VALUES ($1, $2) RETURNING *",
            [user_id, following_id]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { followings_status_id, user_id, following_id } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE followings SET user_id = $2, following_id = $3 WHERE followings_status_id = $1 RETURNING *",
            [followings_status_id, user_id, following_id]
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
        const result = await client.query("DELETE FROM followings WHERE followings_status_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
