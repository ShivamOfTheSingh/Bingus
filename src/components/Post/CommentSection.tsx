"use client";

import { CommentReply, PostComment } from "@/lib/db/models";
import { useState } from "react";
import NewCommentForm from "./NewCommentForm";

interface CommentSectionProps {
    commentsWithReplies: { comment: PostComment, replies: CommentReply[] }[];
    postId: number;
    userId: number;
    className?: string;
}

export default function CommentSection({ commentsWithReplies, postId, userId, className }: CommentSectionProps) {
    const [comments, setComments] = useState<{ comment: PostComment, replies: CommentReply[] }[]>(commentsWithReplies);

    function handleSubmitStateChange(comment: PostComment) {
        const newCommentWithReplies = {
            comment: comment,
            replies: []
        };
        setComments([...comments, newCommentWithReplies]);
    }

    return (
        <div>
        </div>
    );
}