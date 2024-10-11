import { Post } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table posts - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM posts WHERE post_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Post record not found", { status: 404 });
        }

        const post: Post = {
            postId: result.rows[0].post_id,
            userId: result.rows[0].user_id,
            caption: result.rows[0].caption,
            datePosted: new Date(result.rows[0].date_posted)  // Convert to Date object
        };
        return new Response(JSON.stringify(post), { status: 200 });
    } 
    catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
