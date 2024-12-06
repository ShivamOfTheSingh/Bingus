import { Media } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

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
                format: row.format
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
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }

        const { postId, base64Data } = await request.json();

        const prefix = base64Data.split(",")[0];
        const data = base64Data.split(",")[1];
        const format = prefix.split(";")[0].split("/")[1];
        const binaryData = Buffer.from(data, 'base64');

        client = await pool.connect();
        const result = await client.query("INSERT INTO media (post_id, data, format) VALUES ($1, $2, $3) RETURNING media_id", [postId, binaryData, format]);
        const mediaId = result.rows[0].media_id;

        return new Response(JSON.stringify({ id: mediaId }), { status: 201 });
    } 
    catch (error) {
        console.log(error);
        return new Response("Internal Server Error", { status: 500 });
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
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }

        const { mediaId, postId, base64Data } = await request.json();

        const prefix = base64Data.split(",")[0];
        const data = base64Data.split(",")[1];
        const format = prefix.split(";")[0].split("/")[1];
        const binaryData = Buffer.from(data, 'base64');

        client = await pool.connect();
        const result = await client.query("UPDATE media SET post_id = $1, data = $2, format = $3 WHERE media_id = $4", [postId, binaryData, format, mediaId]);

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
        const userId = await getCurrentSessionUserId();
        if (userId === -1 || userId !== id) {
            return new Response("Unauthorized API call", { status: 401 });
        }
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
