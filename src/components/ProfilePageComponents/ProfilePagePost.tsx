"use client";

import { Media, Post } from "@/lib/db/models";
import { Card } from "react-bootstrap";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import Image from "next/image";

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
                <Image src={thumbnail.mediaUrl} alt="thumbnail" width={200} height={200} />
            </Card.Body>
            <Card.Footer>
                {timestampToTimeAgo(new Date(post.datePosted))}
            </Card.Footer>
        </Card>
    );
}