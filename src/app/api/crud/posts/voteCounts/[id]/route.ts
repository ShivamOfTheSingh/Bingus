import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT COUNT(*), post_vote_value FROM post_vote WHERE post_id = $1 GROUP BY post_vote_value", [params.id]);

        console.log(result.rows);

        const response = {
            countPositive: result.rows.filter((r: any) => r.post_vote_value === true).length > 0 ? result.rows.filter((r: any) => r.post_vote_value === true)[0].count : 0,
            countNegative: result.rows.filter((r: any) => r.post_vote_value === false).length > 0 ? result.rows.filter((r: any) => r.post_vote_value === false)[0].count : 0
        };

        return new Response(JSON.stringify(response), { status: 200 });
    }
    catch (error: any) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}