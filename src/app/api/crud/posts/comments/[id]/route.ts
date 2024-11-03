import { PostComment } from "@/lib/db/models";
import pool from "@/lib/db/pool";

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<Response> {
    let client;
    try {
        client = await pool.connect();

        const result = await client.query("SELECT * FROM post_comment WHERE post_id = $1", [params.id]);
        
        const comments: PostComment[] = result.rows.map((row: any) => {
            const comment: PostComment = {
                postCommentId: row.post_comment_id,
                postId: row.post_id,
                userId: row.user_id,
                postComment: row.post_comment,
                dateCommented: new Date(row.date_commented)
            };
            return comment;
        });

        return new Response(JSON.stringify(comments), { status: 200 });
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