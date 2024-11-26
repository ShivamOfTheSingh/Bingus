import pool from "@/lib/db/pool";
import { Chat, CreateNewChat } from "@/lib/db/models";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * POST endpoint for creating a new chat
 *
 * @param {Request} request The incoming HTTP request with currentUserId and selectedUserId as the body
 * @returns {Response} The HTTP response containing the new chat ID or an error code
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }

        const { currentUserId, selectedUserId } = await request.json();

        if (!currentUserId || !selectedUserId) {
            return new Response(JSON.stringify({ error: "Missing user IDs" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        client = await pool.connect();

        // Check if a chat already exists between the users
        const existingChat = await client.query(
            `SELECT chat_id 
             FROM group_members 
             WHERE user_id = $1 AND chat_id IN 
             (SELECT chat_id FROM group_members WHERE user_id = $2)`,
            [currentUserId, selectedUserId]
        );

        if (existingChat.rows.length > 0) {
            return new Response(
                JSON.stringify({
                    chatId: existingChat.rows[0].chat_id,
                    message: "Chat already exists",
                }),
                { status: 200 }
            );
        }

        // Create a new chat
        const newChat = await client.query(
            "INSERT INTO chat (chat_name) VALUES ($1) RETURNING chat_id",
            [`Private chat between ${currentUserId} and ${selectedUserId}`]
        );

        const chatId: Chat = newChat.rows[0].chat_id;

        // Insert both users into the group_members table
        await client.query(
            "INSERT INTO group_members (user_id, chat_id) VALUES ($1, $2), ($3, $2)",
            [currentUserId, chatId, selectedUserId]
        );

        return new Response(
            JSON.stringify({
                chatId,
                message: "Chat created successfully",
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating chat:", error);
        return new Response(JSON.stringify({ error: "Failed to create chat" }), { status: 500, headers: { "Content-Type": "application/json" } });
    } finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * GET endpoint for fetching all chats involving the current user
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Chat objects or an error code
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }

        client = await pool.connect();

        const result = await client.query(
            `SELECT DISTINCT ON (c.chat_id)
            c.chat_id AS chatid, 
            u.user_name AS username, 
            COALESCE(m.messages_text, '') AS lastMessage
        FROM chat c
        JOIN group_members gm ON c.chat_id = gm.chat_id
        JOIN user_profile u ON gm.user_id = u.user_id
        LEFT JOIN LATERAL (
            SELECT m.messages_text
            FROM messages m
            WHERE m.chat_id = c.chat_id
            ORDER BY m.messages_timestamp DESC
            LIMIT 1
        ) m ON true
        WHERE gm.chat_id IN (
            SELECT chat_id 
            FROM group_members 
            WHERE user_id = $1
        ) AND u.user_id != $1;
        `,
            [userId]
        );

        const chats = result.rows.map((row: any) => ({
            chatid: row.chatid,
            username: row.username,
            lastMessage: row.lastmessage,
        }));

        return new Response(JSON.stringify(chats), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch chats" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    } finally {
        if (client) {
            client.release();
        }
    }
}



