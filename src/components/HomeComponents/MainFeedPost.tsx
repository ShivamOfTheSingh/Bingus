"use client";

import { Media, Post } from "@/lib/db/models";
import { Card } from "react-bootstrap";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import Image from "next/image";

interface PostProps {
    post: Post;
    userProfileImage: string;  
    userName: string;          
    userUsername: string;      
    media: Media;              
    className?: string;
}

export default function MainFeedPost({
    post,
    userProfileImage,
    userName,
    userUsername,
    media,
    className,
}: PostProps) {
    return (
        <Card className={`${className} w-72 h-auto my-4`}>
            
            <Card.Header className="d-flex align-items-center">
                <Image
                    src={userProfileImage}
                    alt="User Profile Image"
                    width={40}
                    height={40}
                    className="rounded-circle me-2"
                />
                <div>
                    <div className="font-weight-bold">{userName}</div>
                    <div className="text-muted">@{userUsername}</div>
                </div>
            </Card.Header>

            {/* Media and Caption */}
            <Card.Body>
                
                {media && media.mediaUrl && (
                    <div className="mb-3">
                        <Image
                            src={media.mediaUrl}
                            alt="Post Media"
                            width={300}
                            height={300}
                            className="rounded-lg"
                        />
                    </div>
                )}
                
                {/* Display Caption */}
                <Card.Text>{post.caption}</Card.Text>
            </Card.Body>

            {/* Timestamp Footer */}
            <Card.Footer className="text-muted">
                {timestampToTimeAgo(new Date(post.datePosted))}
            </Card.Footer>
        </Card>
    );
}
