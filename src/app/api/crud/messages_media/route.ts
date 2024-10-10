import { MessagesMedia } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { accessSync } from "fs";

/**
 * GET endpoint for table messages_media (Fetch all message media records)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Message Media objects or an error code
 */
export async function GET(request: Request): Promise<Response> { 
    let client; 
    try { 
        client = await pool.connect(); 
        const result = await client.query("SELECT * FROM messages_media");
        const messagesMediaList: MessagesMedia[] = result.rows.map((row: any) => (
            {
                messagesMediaId: row.messages_media_id,
                messagesId: row.messages_id,
                messagesMedia: row.mime_type_prefix + Buffer.from(row.messages_media, 'base64').toString('base64')
            }
        ));
        return new Response(JSON.stringify(messagesMediaList), { status: 200 });
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
 * POST endpoint for table messages media (Create a new message media record)
 * 
 * @param {Request} request The incoming HTTP request with Message Media object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> { 
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        const messagesMedia: MessagesMedia = await request.json();
        const mimeTypePrefix = messagesMedia.messagesMedia.slice(0, messagesMedia.messagesMedia.indexOf(",") + 1);
        const messagesMediaBuffer = Buffer.from(messagesMedia.messagesMedia.slice(mimeTypePrefix.length), 'base64');

        client = await pool.connect(); 
        const result = await client.query(
            "INSERT INTO messages_media (messages_id, messages_media, mime_type_prefix) VALUES ($1, $2, $3) RETURNING messages_media_id", 
            [messagesMedia.messagesId, messagesMediaBuffer, mimeTypePrefix]
        );
        const id = result.rows[0].message_media_id;
        return new Response(JSON.stringify({ messagesMediaId: id }), { status: 201 });
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
 * PUT endpoint for table messages_media (Update an existing message media record)
 * 
 * @param {Request} request The incoming HTTP request with Message Media object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> { 
    let client; 
    try { 
        const userId = await getCurrentSessionUserId(); 
        if (userId === -1) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        const messagesMedia: MessagesMedia = await request.json(); 
        const mimeTypePrefix = messagesMedia.messagesMedia.slice(0, messagesMedia.messagesMedia.indexOf(",") + 1);
        const mediaUrlBuffer = Buffer.from(messagesMedia.messagesMedia.slice(mimeTypePrefix.length), 'base64');

        client = await pool.connect(); 
        await client.query(
            "UPDATE messages_media SET messages_id = $2, messages_media = $3, mime_type_prefix = $4 WHERE messages_media_id = $1", 
            [messagesMedia.messagesMediaId, messagesMedia.messagesId, mediaUrlBuffer, mimeTypePrefix]
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
        const userId = await getCurrentSessionUserId(); 
        if (userId === -1 || userId !== id) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        client = await pool.connect(); 
        await client.query("DELETE FROM messages_media WHERE messages_media_id = $1", [id]);

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
