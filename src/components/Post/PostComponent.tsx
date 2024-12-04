"use client";

import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { Post, UserProfile, Media, PostVote } from "@/lib/db/models";
import MediaScroll from "./MediaScroll";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import LikeButton from "./LikeButton";
import { useState } from "react";

interface PostComponentProps {
    post: Post;
    media: Media[];
    user: UserProfile;
    voteCount: number;
    userVote: PostVote | null;
    userIdSelf: number;
    className?: string;
}

export default function PostComponent({ post, media, user, voteCount, userVote, userIdSelf, className }: PostComponentProps) {
    const [userVoteState, setUserVoteState] = useState<PostVote | null>(userVote);

    async function onLike() {
        if (userVoteState) {
            await fetch("https://bingus.website/api/crud/post_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: userVoteState.postVoteId })
            });
            setUserVoteState(null);
        }
        else {
            const newVote: PostVote = {
                userId: userIdSelf,
                postId: post.postId || -1
            };
            const response = await fetch("https://bingus.website/api/crud/post_vote", {
                method: "POST",
                body: JSON.stringify(newVote)
            });
            const { postVoteId } = await response.json();
            newVote.postVoteId = postVoteId;
            setUserVoteState(newVote);
        }
    }

    return (
        <Container className={`${className} flex flex-col items-center`}>
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
                    <LikeButton liked={userVoteState ? true : false} count={voteCount} onClick={onLike} size={"lg"} />
                </Col>
            </Row>
        </Container>
    );
}