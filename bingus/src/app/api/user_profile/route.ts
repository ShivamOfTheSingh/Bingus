// api/user_profile
import { NextRequest } from "next/server";
import pool from "../pool";

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM user_profile");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

// REPALCE WITH DAMIANS
export async function POST(request: NextRequest) {
    try {
        const { user_name, email, first_name, last_name, gender, birth_date, about, profile_pic } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "INSERT INTO user_profile (user_name, email, first_name, last_name, gender, birth_date, about, profile_pic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [user_name, email, first_name, last_name, gender, birth_date, about, profile_pic]
        );
        client.release();

        return new Response(JSON.stringify(result.rows[0]), { status: 201 });
    } catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { user_id, user_name, email, first_name, last_name, gender, birth_date, about, profile_pic } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            "UPDATE user_profile SET user_name = $2, email = $3, first_name = $4, last_name = $5, gender = $6, birth_date = $7, about = $8, profile_pic = $9 WHERE user_id = $1 RETURNING *",
            [user_id, user_name, email, first_name, last_name, gender, birth_date, about, profile_pic]
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
        const result = await client.query("DELETE FROM user_profile WHERE user_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify({ message: "User profile deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}
