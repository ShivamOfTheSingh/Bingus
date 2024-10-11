import { Following } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table followings (Fetch all followings)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Following objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM followings");
        const followings: Following[] = result.rows.map((row: any) => (
            {
                followingId: row.following_status_id,
                userId: row.user_id,
                followedUserId: row.following_id
            }
        ));
        return new Response(JSON.stringify(followings), { status: 200 });
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
 * POST endpoint for table followings (Create a new following record)
 * 
 * @param {Request} request The incoming HTTP request with Following object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const following: Following = await request.json();
        following.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO followings (user_id, following_id) VALUES ($1, $2) RETURNING followings_status_id",
            [following.userId, following.followedUserId]
        );
        const id = result.rows[0].following_status_id;
        return new Response(JSON.stringify({ follwingId: id }), { status: 201 });
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
 * PUT endpoint for table followings (Update an existing following record)
 * 
 * @param {Request} request The incoming HTTP request with Following object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const following: Following = await request.json();
        following.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE followings SET user_id = $2, following_id = $3 WHERE following_status_id = $1",
            [following.followingId, following.userId, following.followedUserId]
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
 * DELETE endpoint for table followings (Delete a following record by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the following to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        const userId = await getCurrentSessionUserId();
        if (userId === -1 || userId !== id) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        client = await pool.connect();
        await client.query("DELETE FROM followings WHERE following_status_id = $1", [id]);

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
