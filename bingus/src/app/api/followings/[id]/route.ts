// api/followings/[id]
import { NextRequest } from "next/server";
import pool from "../../pool";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params
        const client = await pool.connect();
        const result = await client.query("select * from followings where followings_status_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
}