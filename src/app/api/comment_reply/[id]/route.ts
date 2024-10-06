import { CommentReply } from "@/lib/models";
import pool from "../../../../lib/pool";

/**
 * GET endpoint for table comment_reply - single row by id
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
        const result = await client.query("SELECT * FROM comment_reply WHERE comment_reply_id = $1", [id]);

        if (result.rows.length === 0) {
            return new Response("Not Found", { status: 404 });
        }

        const commentReply: CommentReply = {
            commentReplyId: result.rows[0].comment_reply_id,
            postCommentId: result.rows[0].post_comment_id,
            userId: result.rows[0].user_id,
            reply: result.rows[0].reply,
            dateReplied: new Date(result.rows[0].date_replied)
        };
        return new Response(JSON.stringify(commentReply), { status: 200 });
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
