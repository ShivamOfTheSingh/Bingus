import { GroupMembers } from "../lib/models";
import pool from "../lib/pool";


export async function GET(): Promise<GroupMembers[] | string> {
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
        return groupMembers;
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

export async function GET_BY_ID(id: number): Promise<GroupMembers | string> {
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query("SELECT * FROM group_members WHERE group_member_id = $1", [id]);

        if (result.rows.length === 0) { 
            return "No group members found.";
        }

        const groupMembers: GroupMembers = {
            groupMemberId: result.rows[0].group_member_id,
            userId: result.rows[0].user_id,
            chatId: result.rows[0].chat_id
        };

        return groupMembers;
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

export async function POST(groupMembers: GroupMembers): Promise<string> {
    let client; 
    try { 
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO group_members (user_id, chat_id) VALUES ($1, $2) RETURNING group_member_id"
            [groupMembers.userId, groupMembers.chatId]    
        );
        const id = result.rows[0].group_member_id;
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

export async function PUT(groupMembers: GroupMembers): Promise<string> { 
    let client; 
    try { 
        client = await pool.connect();
        await client.query(
            "UPDATE group_members SET user_id = $2, chat_id = $3 WHERE group_member_id = $1",
            [groupMembers.groupMemberId, groupMembers.userId, groupMembers.chatId]
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
        await client.query("DELETE FROM group_members WHERE group_member_id = $1", [id]);

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