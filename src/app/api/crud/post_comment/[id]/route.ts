import { PostComment } from "@/lib/db/models";
import pool from "../../../../../lib/db/pool";

/**
 * GET endpoint for table post_comment - single row by id
 * 
 * @param {Request} request The incoming HTTP request
 * @param {string} param1 The id of the row to return
 * @returns {Response} Status code HTTP response
 */
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        const id = parseInt(params.id);
        client = await pool.connect();
        const result = await client.query("SELECT * FROM post_comment WHERE post_comment_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Post comment record not found", { status: 404 });
        }

        const postComment: PostComment = {
            postCommentId: result.rows[0].post_comment_id,
            postId: result.rows[0].post_id,
            userId: result.rows[0].user_id,
            postComment: result.rows[0].post_comment,
            dateCommented: new Date(result.rows[0].date_commented)  // Convert to Date object
        };
        return new Response(JSON.stringify(postComment), { status: 200 });
    } 
    catch (error) {
        return new Response("Failed to retrieve data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
