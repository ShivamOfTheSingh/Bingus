// api/comment_reply/[id]
import { NextRequest } from "next/server";
import pool from "../../../../lib/pool";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const client = await pool.connect();
        const result = await client.query("select * from comment_reply where comment_reply_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}
