"use client";

import { CommentReply, PostComment, UserProfile, CommentVote } from "@/lib/db/models";
import { useState } from "react";
import NewCommentForm from "./NewCommentForm";
import CommentComponent from "./CommentComponent";

interface CommentSectionProps {
    commentsWithReplies: { user: UserProfile, userVote: CommentVote | null, voteCount: number, comment: PostComment, replies: { reply: CommentReply, user: UserProfile }[] }[];
    postId: number;
    userSelf: UserProfile;
    className?: string;
}

export default function CommentSection({ commentsWithReplies, postId, userSelf, className }: CommentSectionProps) {
    const [comments, setComments] = useState<{ user: UserProfile, userVote: CommentVote | null, voteCount: number, comment: PostComment, replies: { reply: CommentReply, user: UserProfile }[] }[]>(commentsWithReplies);

    function handleSubmitStateChange(comment: PostComment) {
        const newComment = {
            user: userSelf,
            userVote: null,
            voteCount: 0,
            comment: comment,
            replies: []
        };
        setComments([...comments, newComment]);
    }

    return (
        <div className={`${className} flex flex-col items-center`}>
            <NewCommentForm onSubmitDecorator={handleSubmitStateChange} postId={postId} />
            <div className="flex flex-col gap-5">
                {comments.map((comment) => {
                    return <CommentComponent key={comment.comment.postCommentId}
                        user={comment.user}
                        comment={comment.comment}
                        replies={comment.replies}
                        voteCount={comment.voteCount}
                        userVote={comment.userVote}
                        userSelf={userSelf}
                    />;
                })}
            </div>
        </div>
    );
}