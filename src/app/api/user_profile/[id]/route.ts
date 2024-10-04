// api/user_profile/[id]
import { NextRequest } from "next/server";
import pool from "../../../../lib/pool";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const { id } = params
        const client = await pool.connect();
<<<<<<< HEAD
        const result = await client.query("select * from user_profile where user_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 });
=======
        const result = await client.query("select * from posts where user_id = $1", [id]);
        client.release();

        return new Response(JSON.stringify(result.rows), { status: 200 });
    } catch (error) {
        return new Response("Failed to delete data", { status: 500 });
>>>>>>> 19741fd64d03f7f6966d5f6b937029ae96b80f0e
    }
}