"use client";

import { CommentReply, CommentVote, PostComment, UserProfile } from "@/lib/db/models";
import Image from "next/image";
import { useState } from "react";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import formatDate from "@/lib/utils/formatDate";
import LikeButton from "./LikeButton";
import NewReplyForm from "./NewReplyForm";
import "@/public/CommentComponent.css";

interface CommentComponentProps {
    user: UserProfile;
    comment: PostComment;
    replies: { reply: CommentReply; user: UserProfile }[];
    voteCount: number;
    userVote: CommentVote | null;
    userSelf: UserProfile;
    className?: string;
}

export default function CommentComponent({
    user,
    comment,
    replies,
    voteCount,
    userVote,
    userSelf,
    className,
}: CommentComponentProps) {
    const [repliesState, setRepliesState] = useState<
        { reply: CommentReply; user: UserProfile }[]
    >(replies);
    const [userVoteState, setUserVoteState] = useState<CommentVote | null>(userVote);

    function handleSubmitStateChange(reply: CommentReply) {
        const newReply = { reply, user };
        setRepliesState([...repliesState, newReply]);
    }

    async function onLike() {
        if (userVoteState) {
            await fetch("http://localhost:3000/api/crud/comment_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: userVoteState.commentVoteId }),
            });
            setUserVoteState(null);
        } else {
            const newVote: CommentVote = {
                userId: userSelf.userId || -1,
                postCommentId: comment.postCommentId || -1,
            };
            const response = await fetch("http://localhost:3000/api/crud/comment_vote", {
                method: "POST",
                body: JSON.stringify(newVote),
            });
            const { commentVoteId } = await response.json();
            newVote.commentVoteId = commentVoteId;
            setUserVoteState(newVote);
        }
    }

    return (
        <div className={`main-container ${className}`}>
            {/* Comment Header */}
            <div className="comment-header">
                <Image
                    src={user.profilePicture || profilePicTemp}
                    alt={user.username}
                    height={50}
                    width={50}
                    className="profile-pic"
                />
                <div className="user-info">
                    <span className="username">{user.username}</span>
                    <span className="timestamp">{formatDate(comment.dateCommented)}</span>
                </div>
            </div>

            {/* Comment Content */}
            <div className="comment-content">
                <p className="comment-text">{comment.postComment}</p>
            </div>

            {/* Like and Reply Section */}
            <div className="comment-actions">
                <LikeButton
                    liked={!!userVoteState}
                    count={voteCount}
                    onClick={onLike}
                    size="sm"
                />
                <NewReplyForm
                    className="new-reply-form"
                    onSubmitDecorator={handleSubmitStateChange}
                    commentId={comment.postCommentId || -1}
                />
            </div>

            {/* Replies */}
            <div className="comment-replies">
                {repliesState.map((r, idx) => (
                    <div key={idx} className="reply-container">
                        <div className="reply-header">
                            <Image
                                src={r.user.profilePicture || profilePicTemp}
                                alt={r.user.username}
                                width={30}
                                height={30}
                                className="profile-pic"
                            />
                            <span className="reply-username">{r.user.username}</span>
                        </div>
                        <div className="reply-content">
                            <p>{r.reply.reply}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
