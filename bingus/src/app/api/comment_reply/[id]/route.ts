// app/api/comment_reply/[id]
import { NextRequest } from "next/server";
import pg from "pg";
const { Pool } = pg;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const pool = new Pool({
            user: "postgres",
            password: "Bingus_LLC",
            host: "bingus-db-1.c9ayqsiuu3wz.us-east-1.rds.amazonaws.com",
            port: 5432,
            database: "bingus",
            ssl: {
                rejectUnauthorized: false,
            },
        });
        const client = await pool.connect();
        const result = await client.query("select * from comment_reply where comment_reply_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}
