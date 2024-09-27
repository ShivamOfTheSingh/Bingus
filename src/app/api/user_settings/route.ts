// api/user_settings
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM user_settings");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { user_id, show_name, profile_public, date_registered } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO user_settings (user_id, show_name, profile_public, date_registered) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, show_name, profile_public, date_registered]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { user_settings_id, user_id, show_name, profile_public, date_registered } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE user_settings SET user_id = $2, show_name = $3, profile_public = $4, date_registered = $5 WHERE user_settings_id = $1 RETURNING *",
            [user_settings_id, user_id, show_name, profile_public, date_registered]
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
        const result = await client.query("DELETE FROM user_settings WHERE user_settings_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify({ message: "User settings deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
