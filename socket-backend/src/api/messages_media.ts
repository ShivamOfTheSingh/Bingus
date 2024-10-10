import pool from "../lib/pool";
import { MessagesMedia } from "../lib/models";

export async function GET(): Promise<MessagesMedia[] | string> { 
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
        return messagesMediaList;
    }
    catch (error) {
        return "An error occured";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function GET_BY_ID(id: number): Promise<MessagesMedia | string> {
    let client; 
    try { 
        client = await pool.connect(); 
        const result = await client.query("SELECT * FROM messages_media WHERE messages_media_id = $1", [id]);

        if (result.rows.length === 0) { 
            return "No message media found.";
        }

        const messagesMedia: MessagesMedia = { 
            messagesMediaId: result.rows[0].message_media_id,
            messagesId: result.rows[0].messages_id,
            messagesMedia: result.rows[0].mime_type_prefix + Buffer.from(result.rows[0].messages_media, 'base64').toString('base64')
        };

        return messagesMedia;
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function POST(messagesMedia: MessagesMedia): Promise<string> { 
    let client; 
    try { 
        const mimeTypePrefix = messagesMedia.messagesMedia.slice(0, messagesMedia.messagesMedia.indexOf(",") + 1);
        const messagesMediaBuffer = Buffer.from(messagesMedia.messagesMedia.slice(mimeTypePrefix.length), 'base64');

        client = await pool.connect(); 
        const result = await client.query(
            "INSERT INTO messages_media (messages_id, messages_media, mime_type_prefix) VALUES ($1, $2, $3) RETURNING messages_media_id", 
            [messagesMedia.messagesId, messagesMediaBuffer, mimeTypePrefix]
        );
        const id = result.rows[0].message_media_id;
        return id;
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function PUT(messagesMedia: MessagesMedia): Promise<string> { 
    let client; 
    try { 
        const mimeTypePrefix = messagesMedia.messagesMedia.slice(0, messagesMedia.messagesMedia.indexOf(",") + 1);
        const mediaUrlBuffer = Buffer.from(messagesMedia.messagesMedia.slice(mimeTypePrefix.length), 'base64');

        client = await pool.connect(); 
        await client.query(
            "UPDATE messages_media SET messages_id = $2, messages_media = $3, mime_type_prefix = $4 WHERE messages_media_id = $1", 
            [messagesMedia.messagesMediaId, messagesMedia.messagesId, mediaUrlBuffer, mimeTypePrefix]
        );

        return "OK";
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

export async function DELETE(id: number): Promise<string> { 
    let client; 
    try { 
        client = await pool.connect(); 
        await client.query("DELETE FROM messages_media WHERE messages_media_id = $1", [id]);

        return "OK";
    }
    catch (error) {
        return "An error occured.";
    }
    finally {
        if (client) {
            client.release();
        }
    }
}