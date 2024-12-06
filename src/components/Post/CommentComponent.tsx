"use client";

import { CommentReply, CommentVote, PostComment, UserProfile } from "@/lib/db/models";
import Image from "next/image";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import formatDate from "@/lib/utils/formatDate";
import LikeButton from "./LikeButton";
import NewReplyForm from "./NewReplyForm";
import "@/public/CommentComponent.css";

interface CommentComponentProps {
    user: UserProfile;
    comment: PostComment;
    replies: { reply: CommentReply, user: UserProfile }[];
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
    const [repliesState, setRepliesState] = useState<{ reply: CommentReply, user: UserProfile }[]>(replies);
    const [userVoteState, setUserVoteState] = useState<CommentVote | null>(userVote);

    function handleSubmitStateChange(reply: CommentReply) {
        const newReply = {
            reply: reply,
            user: user
        };
        setRepliesState([...repliesState, newReply]);
    }

    async function onLike() {
        if (userVoteState) {
            await fetch("http://localhost:3000/api/crud/comment_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: userVoteState.commentVoteId })
            });
            setUserVoteState(null);
        }
        else {
            const newVote: CommentVote = {
                userId: userSelf.userId || -1,
                postCommentId: comment.postCommentId || -1
            };
            const response = await fetch("http://localhost:3000/api/crud/comment_vote", {
                method: "POST",
                body: JSON.stringify(newVote)
            });
            const { commentVoteId } = await response.json();
            newVote.commentVoteId = commentVoteId;
            setUserVoteState(newVote);
        }
    }

    return (
        <Container className={`flex flex-col items-center ${className}`}>
            <Row className="comment-header">
                <Col lg={4}>
                    <Image src={user.profilePicture || profilePicTemp} alt={user.username} height={50} width={50} />
                </Col>
                <Col lg={8}>
                    <span className="comment-user">{user.username}</span>
                </Col>
            </Row>
            <Row className="comment-content">
                <Col lg={8} style={{ wordWrap: "break-word", whiteSpace: "normal" }}>
                    <p className="comment-text">{comment.postComment}</p>
                </Col>
                <Col lg={4}>
                    <LikeButton liked={userVoteState ? true : false} count={voteCount} onClick={onLike} size={"sm"} />
                </Col>
            </Row>
            <Row className="comment-timestamp">
                <span>{formatDate(comment.dateCommented)}</span>
            </Row>
            
            {/* Replies Section */}
            <Row className="comment-replies">
                {repliesState.map((r: { reply: CommentReply, user: UserProfile }) => {
                    return (
                        <Col style={{ wordWrap: "break-word", paddingLeft: "20px" }}>
                            <Row className="reply-header">
                                <Col>
                                    <Image src={r.user.profilePicture} alt={r.user.username} width={30} height={30} />
                                </Col>
                                <Col>
                                    <span className="reply-user">{r.user.username}</span>
                                </Col>
                            </Row>
                            <Row className="reply-content">
                                <Col>
                                    <p className="reply-text">{r.reply.reply}</p>
                                </Col>
                            </Row>
                        </Col>
                    );
                })}
            </Row>
            
            {/* New Reply Form */}
            <NewReplyForm className="new-reply-form" onSubmitDecorator={handleSubmitStateChange} commentId={comment.postCommentId || -1} />
        </Container>
    );
}
