"use client";

import { CommentReply, CommentVote, PostComment, UserProfile } from "@/lib/db/models";
import Image from "next/image";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import profilePicTemp from "@/public/profile-pic-temp.jpg";
import formatDate from "@/lib/utils/formatDate";
import LikeButton from "./LikeButton";

interface CommentComponentProps {
    user: UserProfile;
    comment: PostComment;
    replies: CommentReply[];
    voteCount: number;
    userVote: CommentVote | null;
    userIdSelf: number;
    className?: string;
}

export default function CommentComponent({ user, comment, replies, voteCount, userVote, userIdSelf, className }: CommentComponentProps) {
    const [repliesState, setRepliesState] = useState<CommentReply[]>(replies);
    const [userVoteState, setUserVoteState] = useState<CommentVote | null>(userVote);

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
                userId: userIdSelf,
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
        <Container className="flex flex-col items-center">
            <Row>
                <Col lg={4}>
                    <Image src={user.profilePicture || profilePicTemp} alt={user.username} height={50} width={50}/>
                </Col>
                <Col lg={8}>
                    {user.username}
                </Col>
            </Row>
            <Row>
                <Col lg={8}>
                    {comment.postComment}
                </Col>
                <Col lg={4}>
                    <LikeButton liked={userVoteState ? true : false} count={voteCount} onClick={onLike} size={"sm"} />
                </Col>
            </Row>
            <Row className="text-xs">
                {formatDate(comment.dateCommented)}
            </Row>
        </Container>
    );
}