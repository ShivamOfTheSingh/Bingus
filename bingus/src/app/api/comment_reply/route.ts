import { NextRequest } from "next/server";
import pg from "pg";
const { Pool } = pg;

export async function GET(request: NextRequest) {
    try {
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
        const result = await client.query("select * from comment_reply");
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function POST(request:NextRequest) {
    try {
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

        const { post_comment_id, user_id, reply, date_replied } = await request.json();
        const client = await pool.connect();
        const result = await client.query("insert into comment_reply (post_comment_id, user_id, reply, date_replied) values ($1, $2, $3, $4)", [post_comment_id, user_id, reply, date_replied]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
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

        const { comment_reply_id, post_comment_id, user_id, reply, date_replied } = await request.json();
        const client = await pool.connect();
        const result = await client.query(`update comment_reply set post_comment_id = $2 where comment_reply_id = $1`, [comment_reply_id, post_comment_id, user_id, reply, date_replied]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
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

        const { id } = await request.json();
        const client = await pool.connect();
        const result = await client.query("delete from comment_reply where comment_reply_id=$1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to retrieve data", { status: 500 })
    }
}
