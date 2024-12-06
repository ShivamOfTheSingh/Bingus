"use client";

import { Media, Post } from "@/lib/db/models";
import { Card } from "react-bootstrap";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import { useState, useEffect } from "react";
import Link from "next/link";
import "@/public/ProfilePagePost.css";
import ImageWrapper from "../Media/ImageWrapper";
import VideoWrapper from "../Media/VideoWrapper";
import Loader from "../Loader";

interface ProfilePagePostProps {
    post: Post,
    className?: string;
}

export default function ProfilePagePost({ post, className }: ProfilePagePostProps) {
    const [thumbnail, setThumbnail] = useState<Media>();

    useEffect(() => {
        async function fetchThumbnailInfo() {
            const response = await fetch(`http://localhost:3000/api/crud/posts/media/${post.postId}`);
            if (response.status !== 404) {
                const json = await response.json();
                const thumbnailInfo: Media = json[0];
                setThumbnail(thumbnailInfo);
            }
        }
        fetchThumbnailInfo();
    }, []);

    return (
        <Link href={`/post/${post.postId}`} className="no-underline">
            <Card className={`profile-post-card ${className}`}>
                <Card.Body>
                    <Card.Text>
                        {post.caption}
                    </Card.Text>
                    {thumbnail ?
                        thumbnail.format === "mp4" ?
                            <VideoWrapper
                                mediaId={thumbnail.mediaId}
                                width={200}
                                height={200}
                                loaderWidth={100}
                                loaderHeight={100}
                            />
                            :
                            <ImageWrapper
                                mediaId={thumbnail.mediaId}
                                width={200}
                                height={200}
                                loaderWidth={100}
                                loaderHeight={100}
                            />
                        :
                        <Loader width={100} height={100} />
                    }
                </Card.Body>
                <Card.Footer>
                    {timestampToTimeAgo(new Date(post.datePosted))}
                </Card.Footer>
            </Card>
        </Link>
    );
}
