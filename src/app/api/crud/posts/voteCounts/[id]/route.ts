import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT COUNT(*), post_vote_value FROM post_vote WHERE post_id = $1 GROUP BY post_vote_value", [params.id]);

        const response = {
            countPositive: result.rows[0].count,
            countNegative: result.rows[1].count
        };

        return new Response(JSON.stringify(response), { status: 200 });
    }
    catch (error: any) {
        return new Response("Internal server error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}