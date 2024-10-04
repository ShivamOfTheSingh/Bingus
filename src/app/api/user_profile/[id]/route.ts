// api/user_profile/[id]
import { NextRequest } from "next/server";
import pool from "../../../../lib/pool";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params
        const client = await pool.connect();
        const result = await client.query("select * from user_profile where user_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
    }
}