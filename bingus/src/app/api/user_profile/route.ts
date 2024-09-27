// api/user_profile
import { NextRequest } from "next/server";
import pool from "../../../lib/pool";

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

import { UserProfile } from "@/lib/models";
import pg from "pg";
const { Pool } = pg;

/**
 * Creates a new user profile in the database.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response with appropriate status.
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        // Get user profile from HTTP request data
        const userProfile: UserProfile = await request.json();

        // Open DB connection
        client = await pool.connect();
        // Check if user already exists
        const userExistsResult = await client.query(`SELECT * FROM user_profile WHERE user_name = '${userProfile.username}' OR email = '${userProfile.email}'`);
        if (userExistsResult.rows.length > 0) {
            return new Response("User already exists", { status: 409 });
        }
        else {
            const insertResult = await client.query(`
                INSERT INTO user_profile
                (
                    user_name,
                    email,
                    first_name,
                    last_name,
                    gender,
                    birth_date
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                ) RETURNING user_profile.user_id
            `, [userProfile.username, userProfile.email, userProfile.firstName, userProfile.lastName, userProfile.gender, userProfile.birthDate]);
            // Get user ID to return
            const userId = insertResult.rows[0].user_id;
            // Return newly created user ID
            return Response.json({ userId: userId }, { status: 201 });
        }
    }
    catch (error: any) {
        return new Response("Internal Server Error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
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
