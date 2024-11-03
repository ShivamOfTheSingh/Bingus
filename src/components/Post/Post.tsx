"use client";

import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { Post, UserProfile, Media, PostVote } from "@/lib/db/models";
import MediaScroll from "./MediaScroll";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { useState } from "react";

interface PostComponentProps {
    post: Post;
    media: Media[];
    user: UserProfile;
    voteCounts: VoteCounts;
    userVote: PostVote | null;
    userIdSelf: number;
    className?: string;
}

interface VoteCounts {
    countPositive: number;
    countNegative: number;
}

export default function PostComponent({ post, media, user, voteCounts, userVote, userIdSelf, className }: PostComponentProps) {
    const [userVoteState, setUserVoteState] = useState<PostVote | null>(userVote);
    const [liked, setLiked] = useState<boolean>(userVote ? userVote.postVoteValue ? true : false : false);
    const [likeCount, setLikeCount] = useState<number>(voteCounts.countPositive);
    const [disliked, setDisliked] = useState<boolean>(userVote ? !userVote.postVoteValue ? true : false : false);
    const [dislikeCount, setDislikeCount] = useState<number>(voteCounts.countNegative);

    async function onLike() {
        if (!userVoteState) {
            const newUserVote: PostVote = {
                postId: post.postId ? post.postId : -1,
                userId: userIdSelf,
                postVoteValue: true
            };

            const response = await fetch("http://localhost:3000/api/crud/post_vote", {
                method: "POST",
                body: JSON.stringify(newUserVote)
            });

            const { postVoteId } = await response.json();
            newUserVote.postVoteId = postVoteId;
            setUserVoteState(newUserVote);
            setLiked(true);
            setLikeCount(likeCount + 1);
        }
        else {
            if (userVoteState.postVoteValue) {
                await fetch("http://localhost:3000/api/crud/post_vote", {
                    method: "DELETE",
                    body: JSON.stringify({ id: userVoteState.postVoteId })
                });

                setUserVoteState(null);
                setLiked(false);
                setLikeCount(likeCount - 1);
            }
            else {
                setDisliked(false);
                setDislikeCount(dislikeCount - 1);
                await fetch("http://localhost:3000/api/crud/post_vote", {
                    method: "PUT",
                    body: JSON.stringify({ ...userVoteState, postVoteValue: true })
                });

                setUserVoteState({ ...userVoteState, postVoteValue: true });
                setLiked(true);
                setLikeCount(likeCount + 1);
            }
        }
    }

    async function onDislike() {
        if (!userVoteState) {
            const newUserVote: PostVote = {
                postId: post.postId ? post.postId : -1,
                userId: userIdSelf,
                postVoteValue: false
            };

            const response = await fetch("http://localhost:3000/api/crud/post_vote", {
                method: "POST",
                body: JSON.stringify(newUserVote)
            });

            const { postVoteId } = await response.json();
            newUserVote.postVoteId = postVoteId;
            setUserVoteState(newUserVote);
            setDisliked(true);
            setDislikeCount(dislikeCount + 1);
        }
        else {
            if (!userVoteState.postVoteValue) {
                await fetch("http://localhost:3000/api/crud/post_vote", {
                    method: "DELETE",
                    body: JSON.stringify({ id: userVoteState.postVoteId })
                });

                setUserVoteState(null);
                setDisliked(false);
                setDislikeCount(dislikeCount - 1);
            }
            else {
                setLiked(false);
                setLikeCount(likeCount - 1);
                await fetch("http://localhost:3000/api/crud/post_vote", {
                    method: "PUT",
                    body: JSON.stringify({ ...userVoteState, postVoteValue: false })
                });

                setUserVoteState({ ...userVoteState, postVoteValue: false });
                setDisliked(true);
                setDislikeCount(dislikeCount + 1);
            }
        }
    }

    return (
        <Container className={className}>
            <Row>
                <Col>
                    <Image src={user.profilePicture} alt={user.username} height={50} width={50} />
                </Col>
                <Col>
                    <Link href={`/profile/${user.userId}`}>
                        {user.username}
                    </Link>
                </Col>
            </Row>
            <Row>
                <MediaScroll media={media} />
            </Row>
            <Row>
                {post.caption}
            </Row>
            <Row>
                {timestampToTimeAgo(post.datePosted)}
            </Row>
            <Row>
                <Col>
                    <LikeButton liked={liked} count={likeCount} onClick={onLike} />
                </Col>
                <Col>
                    <DislikeButton disliked={disliked} count={dislikeCount} onClick={onDislike} />
                </Col>
            </Row>
        </Container>
    );
}