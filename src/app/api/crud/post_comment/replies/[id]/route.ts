import { CommentReply } from "@/lib/db/models";
import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();

        const result = await client.query("SELECT * FROM comment_reply WHERE post_comment_id = $1", [params.id]);
        
        const replies: CommentReply[] = result.rows.map((row: any) => {
            const reply: CommentReply = {
                commentReplyId: row.comment_reply_id,
                postCommentId: row.post_comment_id,
                userId: row.user_id,
                reply: row.reply,
                dateReplied: new Date(row.date_replied)
            };
            return reply;
        });

        return new Response(JSON.stringify(replies), { status: 200 });
    }
    catch (error: any){
        return new Response("Internal server error", { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}