"use client";

import { Col, Container, Row } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { Post, UserProfile, Media } from "@/lib/db/models";
import MediaScroll from "./MediaScroll";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";

interface PostComponentProps {
    post: Post;
    media: Media[];
    user: UserProfile;
    voteCounts: VoteCounts;
    className?: string;
}

interface VoteCounts {
    countPositive: number;
    countNegative: number;
}

export default function PostComponent({ post, media, user, voteCounts, className }: PostComponentProps) {
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
                    <LikeButton liked={true} count={100} onClick={() => {}} />
                </Col>
                <Col>
                    <DislikeButton disliked={false} count={50} onClick={() => {}} />
                </Col>
            </Row>
        </Container>
    );
}