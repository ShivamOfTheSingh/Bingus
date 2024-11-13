import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT COUNT(*) FROM comment_vote WHERE post_comment_id = $1", [params.id]);

        const response = {
            count: parseInt(result.rows[0].count)
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