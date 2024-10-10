import { GroupMembers } from "@/lib/db/models";
import pool from "../../../../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

/**
 * GET endpoint for table group_members (Fetch all group members)
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containing an array of Group Member objects or an error code
 */

export async function GET(request: Request): Promise<Response> {
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query("SELECT * FROM group_members");
        const groupMembers: GroupMembers[] = result.rows.map((row: any) => (
            {
                groupMemberId: row.group_member_id,
                userId: row.user_id,
                chatId: row.chat_id
            }
        ));
        return new Response(JSON.stringify(groupMembers), { status: 200});
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
 * POST endpoint for table group_members (Create a new group member record)
 * 
 * @param {Request} request The incoming HTTP request with Group Member object as the body
 * @returns {Response} Status code HTTP response
 */

export async function POST(request: Request): Promise<Response> {
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) { 
            return new Response("Unauthorized API call", { status: 401 });
        }
        const groupMembers: GroupMembers = await request.json();
        groupMembers.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO group_members (user_id, chat_id) VALUES ($1, $2) RETURNING group_member_id"
            [groupMembers.userId, groupMembers.chatId]    
        );
        const id = result.rows[0].group_member_id;
        return new Response(JSON.stringify({ groupMemberId: id }), { status: 201 });
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
 * PUT endpoint for table group_member (Update an existing group member record)
 * 
 * @param {Request} request The incoming HTTP request with group member object as the body
 * @returns {Response} Status code HTTP response
 */

export async function PUT(request: Request): Promise<Response> { 
    let client; 
    try { 
        const userId = await getCurrentSessionUserId();
        if (userId === -1) {
            return new Response("Unauthorized API call", { status: 401 });
        }
        const groupMembers: GroupMembers = await request.json();
        groupMembers.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE group_members SET user_id = $2, chat_id = $3 WHERE group_member_id = $1",
            [groupMembers.groupMemberId, groupMembers.userId, groupMembers.chatId]
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
 * DELETE endpoint for table group_members (Delete a group member record by ID)
 * 
 * @param {Request} request The incoming HTTP request containing the ID of the group member to delete
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
        await client.query("DELETE FROM group_members WHERE group_member_id = $1", [id]);

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
