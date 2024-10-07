import { Post } from "@/lib/models";
import pool from "@/lib/pool";

/**
 * GET endpoint for all posts for a given profile, by user id
 * 
 * @param {Request} request Incoming HTTP request
 * @param {string} param1 The user id
 * @returns {Response} HTTP response with array of Post objects
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM posts WHERE user_id = $1", [id]);
        const posts: Post[] = result.rows.map((row: any) => (
            {
                postId: row.post_id,
                userId: row.user_id,
                caption: row.caption,
                datePosted: new Date(row.date_posted)
            }
        ));
        return new Response(JSON.stringify(posts), { status: 200 });
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