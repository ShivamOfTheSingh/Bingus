import { Media } from "@/lib/db/models";
import pool from "@/lib/db/pool";
/**
 * GET endpoint for table media - single row by id
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
        const result = await client.query("SELECT * FROM media WHERE media_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Not found", { status: 404 });
        }  

        const mediaInfo: Media = {
            mediaId: result.rows[0].media_id,
            postId: result.rows[0].post_id,
            format: result.rows[0].format
        };

        return new Response(JSON.stringify(mediaInfo), { status: 200 });
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
