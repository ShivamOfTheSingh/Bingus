"use client";

import { Media, Post } from "@/lib/models";
import { Card } from "react-bootstrap";
import { timestampToTimeAgo } from "@/lib/utils";

interface ProfilePagePostProps {
    post: Post,
    thumbnail: Media,
    className?: string;
}

export default function ProfilePagePost({ post, thumbnail, className }: ProfilePagePostProps) {
    return (
        <Card className={`${className} w-72 h-80`}>
            <Card.Body>
                <Card.Text>
                    {post.caption}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                {timestampToTimeAgo(post.datePosted)}
            </Card.Footer>
        </Card>
    );
}