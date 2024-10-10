import { Chat } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { promises } from "dns";

/**
 * GET endpoint for table chat (fetch all chats)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containg an error code or an array of Chat objects
*/
export async function GET(request: Request): Promise<Response> {
    let client; 
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM chat");
        const chat: Chat[] = result.rows.map((row: any) => (
            {
                chatId: row.chat_id,
                chatName: row.chat_name
            }
        ));
        return new Response(JSON.stringify(chat), { status: 200 });
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
 * POST endpoint for table chat (Create a new chat)
 * 
 * @param {Request} request The incoming HTTP request with Chat object as the body
 * @returns {Response} Status code HTTP response
 */

export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const chat: Chat = await request.json();
        chat.chatId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO chat (chat_name) VALUES ($1) RETURNING chat_id",
            [chat.chatName]
        );
        const id = result.rows[0].chat_id;
        return new Response(JSON.stringify({ chatId: id }), { status: 201}); 
    }
    catch (error) {
        console.log(error); 
        return new Response("Failed to create data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * PUT endpoint for table chat (Update an existing chat)
 * 
 * @param {Request} request The incoming HTTP request with chat object as the body
 * @returns {Response} Status code HTTP response
 */

export async function PUT(request: Request): Promise<Response> {
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const chat: Chat = await request.json();
        chat.chatId = userId; 
        client = await pool.connect();
        await client.query(
            "UPDATE chat SET chat_name = $1 WHERE chat_id = $2",
            [chat.chatName]
        );
        return new Response ("Chat name updated", { status: 200 });
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
 * DELETE endpoint for table chat (Delete a chat by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the chat to delete
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
        await client.query("DELETE FROM chat WHERE chat_id = $1", [id]);

        return new Response("Chat deleted", { status: 200 });
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

