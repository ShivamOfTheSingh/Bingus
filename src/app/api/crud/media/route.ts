import { Media } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";

/**
 * GET endpoint for table media (Fetch all media records)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Media objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM media");
        const mediaList: Media[] = result.rows.map((row: any) => (
            {
                mediaId: row.media_id,
                postId: row.post_id,
                mediaUrl: row.mime_type_prefix + Buffer.from(row.media_url, 'base64').toString('base64')
            }
        ));
        return new Response(JSON.stringify(mediaList), { status: 200 });
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
 * POST endpoint for table media (Create a new media record)
 * 
 * @param {Request} request The incoming HTTP request with Media object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const media: Media = await request.json();
        const mimeTypePrefix = media.mediaUrl.slice(0, media.mediaUrl.indexOf(",") + 1);
        const mediaUrlBuffer = Buffer.from(media.mediaUrl.slice(mimeTypePrefix.length), 'base64');  // Convert Base64 to Buffer

        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO media (post_id, media_url, mime_type_prefix) VALUES ($1, $2, $3) RETURNING media_id", 
            [media.postId, mediaUrlBuffer, mimeTypePrefix]
        );
        const id = result.rows[0].media_id;
        return new Response(JSON.stringify({ mediaId: id }), { status: 201 });
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
 * PUT endpoint for table media (Update an existing media record)
 * 
 * @param {Request} request The incoming HTTP request with Media object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const media: Media = await request.json();
        const mimeTypePrefix = media.mediaUrl.slice(0, media.mediaUrl.indexOf(",") + 1);
        const mediaUrlBuffer = Buffer.from(media.mediaUrl.slice(mimeTypePrefix.length), 'base64');

        client = await pool.connect();
        await client.query(
            "UPDATE media SET post_id = $2, media_url = $3, mime_type_prefix = $4 WHERE media_id = $1", 
            [media.mediaId, media.postId, mediaUrlBuffer, mimeTypePrefix]
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
 * DELETE endpoint for table media (Delete a media record by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the media to delete
 * @returns {Response} Status code HTTP response
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM media WHERE media_id = $1", [id]);

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
