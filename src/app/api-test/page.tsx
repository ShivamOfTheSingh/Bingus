"use server";

import { CommentReply } from "@/lib/models";

export default async function Page() {

    const result = await fetch("http://localhost:3000/api/comment_reply/15");
    const commentReply: CommentReply = await result.json();

    console.log(commentReply);

    return (
        <div>Hi</div>
    );
}