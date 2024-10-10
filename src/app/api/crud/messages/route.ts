import { Messages } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { get } from "http";

/**
 * GET endpoint for table messages (Fetch all messages)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Messages objects or an error code
 */
export async function GET(request: Request): Promise<Response> { 
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query("SELECT * FROM messages");
        const messages: Messages[] = result.rows.map((row: any) => (
            {
                messagesId: row.messages_id,
                chatId: row.chat_id,
                userId: row.user_id,
                messagesText: row.messages_text,
                messagesTimestamp: row.messages_timestamp
            }
        ));
        return new Response(JSON.stringify(messages), { status: 200 });
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
 * POST endpoint for table post_comment (Create a new post comment)
 * 
 * @param {Request} request The incoming HTTP request with PostComment object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> { 
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        const messages: Messages = await request.json();
        messages.userId = userId; 
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO messages (chat_id, user_id, messages_text, messages_timestamp) VALUES ($1, $2, $3, $4) RETURNING messages_id",
            [messages.chatId, messages.userId, messages.messagesText, messages.messagesTimestamp]
        );
        const id = result.rows[0].messages_id;
        return new Response(JSON.stringify({ messagesId: id }), { status: 201 });
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
 * PUT endpoint for table messages (Update an existing message)
 * 
 * @param {Request} request The incoming HTTP request with Message object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request:Request): Promise<Response> {
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        const messages: Messages = await request.json();
        messages.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE messages SET chat_id = $2, user_id = $3, messages_text = $4, messages_timestamp = $5 WHERE messages_id = $1",
            [messages.messagesId, messages.chatId, messages.userId, messages.messagesText, messages.messagesTimestamp]
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
 * DELETE endpoint for table messages (Delete a message by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the message to delete
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
        await client.query("DELETE FROM messages WHERE messages_id = $1", [id]);

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