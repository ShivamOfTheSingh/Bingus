import { Media } from "@/lib/db/models";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for all media for a given post, by post id
 * 
 * @param {Request} request Incoming HTTP request
 * @param {string} param1 The post id
 * @returns {Response} HTTP response with array of media objects
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM media WHERE post_id = $1", [id]);
        const mediaList: Media[] = result.rows.map((row: any) => (
            {
                mediaId: row.media_id,
                postId: row.post_id,
                format: row.format
            }
        ));
        return new Response(JSON.stringify(mediaList), { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new Response("Failed to fetch data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}