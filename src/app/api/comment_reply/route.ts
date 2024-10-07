import { CommentReply } from "@/lib/models";
import pool from "../../../lib/pool";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/objectEncryption";
import getCurrentSession from "@/lib/getCurrentSession";

/**
 * GET endpoint for table comment_reply
 * 
 * @param {Request} request The incoming HTTP request
 * @returns {Response} The HTTP response containg an error code or an array of CommentReply objects
 */
export async function GET(request: Request): Promise<Response> {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM comment_reply");
        const commentReplies: CommentReply[] = result.rows.map((row: any) => (
            {
                commentReplyId: row.comment_reply_id,
                postCommentId: row.post_comment_id,
                userId: row.user_id,
                reply: row.reply,
                dateReplied: new Date(row.date_replied)
            }
        ));
        return new Response(JSON.stringify(commentReplies), { status: 200 });
    }
    catch (error) {
        return new Response("Failed to fetch data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * POST endpoint for table comment_reply
 * 
 * @param {Request} request The incoming HTTP request with CommentReply object as the body
 * @returns {Response} Status code HTTP response
 */
export async function POST(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSession();
        const commentReply: CommentReply = await request.json();
        commentReply.userId = userId;
        client = await pool.connect();
        const result = await client.query(
            "INSERT INTO comment_reply (post_comment_id, user_id, reply, date_replied) VALUES ($1, $2, $3, $4) RETURNING comment_reply_id",
            [commentReply.postCommentId, commentReply.userId, commentReply.reply, commentReply.dateReplied]
        );
        const id = result.rows[0].comment_reply_id
        return new Response(JSON.stringify({ commentReplyId: id }), { status: 201 });
    }
    catch (error) {
        return new Response("Failed to create data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * PUT endpoint for table comment_reply
 * 
 * @param {Request} request The incoming HTTP request with CommentReply object as the body
 * @returns {Response} Status code HTTP response
 */
export async function PUT(request: Request): Promise<Response> {
    let client;
    try {
        const userId = await getCurrentSession();
        const commentReply: CommentReply = await request.json();
        commentReply.userId = userId;
        client = await pool.connect();
        await client.query(
            "UPDATE comment_reply SET post_comment_id = $2, user_id = $3, reply = $4, date_replied = $5 WHERE comment_reply_id = $1",
            [commentReply.commentReplyId, commentReply.postCommentId, commentReply.userId, commentReply.reply, commentReply.dateReplied]
        );

        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to update data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}

/**
 * DELETE endpoint for table comment_reply
 * 
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request): Promise<Response> {
    let client;
    try {
        const { id } = await request.json();
        client = await pool.connect();
        await client.query("DELETE FROM comment_reply WHERE comment_reply_id=$1", [id]);

        return new Response("OK", { status: 200 });
    }
    catch (error) {
        return new Response("Failed to delete data", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}
