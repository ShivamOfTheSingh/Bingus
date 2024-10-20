import pool from "@/lib/db/pool";
import { Following } from "@/lib/db/models";
import { NextRequest } from "next/server";

/**
 * GET endpoint - gets a following object by specified user_id and following_id
 * 
 * @param {NextRequest} request - Incoming HTTP request with selfId and followingId as search parameters
 * @returns {Response} - The HTTP response including the following object, 404, or 500 status in case of errors.
 */
export async function GET(request: NextRequest): Promise<Response> {
    let client;
    try {
        const searchParams = request.nextUrl.searchParams;
        const selfId = searchParams.get("selfId");
        const otherId = searchParams.get("otherId");
        
        client = await pool.connect();
        const result = await client.query("SELECT * FROM followings WHERE user_id = $1 AND following_id = $2", [selfId, otherId]);

        if (result.rows.length === 0) {
            return new Response("Following not found", { status: 404 });
        }

        const following: Following = {
            followingId: result.rows[0].followings_status_id,
            userId: result.rows[0].user_id,
            followedUserId: result.rows[0].following_id
        };

        return new Response(JSON.stringify(following), { status: 200 });
    }
    catch (error: any) {
        return new Response("Internal server error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}