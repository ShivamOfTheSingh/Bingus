"use server";

import { CommentVote } from "@/lib/models";

export default async function Page() {

    // API GET BY ID TEST
    const getResult = await fetch("http://localhost:3000/api/comment_vote/20");
    const commentVote: CommentVote = await getResult.json();
    console.log(commentVote);

    return (
        <div>Hi</div>
    );
}