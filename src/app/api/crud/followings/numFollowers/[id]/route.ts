import pool from "@/lib/db/pool";

/**
 * GET endpoint to get number of followers of a user by user ID
 * 
 * @param {Request} request Incoming HTTP request
 * @param {string} id User ID
 * @returns {Response} A JSON response with the number or status 500
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        
        client = await pool.connect();
        const result = await client.query("SELECT COUNT(*) FROM followings WHERE following_id = $1", [id]);

        return new Response(JSON.stringify({ count: result.rows[0].count }), { status: 200 });
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