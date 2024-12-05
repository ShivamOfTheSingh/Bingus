"use client";

import { Media, Post } from "@/lib/db/models";
import { Card } from "react-bootstrap";
import timestampToTimeAgo from "@/lib/utils/timestampToTimeAgo";
import Image from "next/image";
import Link from "next/link";
import '@/public/FeedPostStyle.css'
import LikeButton from "@/components/Post/LikeButton";
import { useState } from "react";

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
        <div className="post-container">
            <Link href={`/post/${post.postId}`} className="no-underline">
                <Card className={`${className} post-card`}>
                    <Card.Header className="post-header">
                        <Image
                            src={userProfileImage}
                            alt="User Profile Image"
                            width={40}
                            height={40}
                            className="user-profile-img"
                        />
                        <div className="user-info">
                            <div className="user-name">{userName}</div>
                            <div className="user-username">@{userUsername}</div>
                        </div>
                    </Card.Header>

                    {/* Media and Caption */}
                    <Card.Body className="post-body">
                        {media && media.mediaUrl && (
                            <div className="post-media">
                                <Image
                                    src={media.mediaUrl}
                                    alt="Post Media"
                                    width={300}
                                    height={300}
                                    className="media-img"
                                />
                            </div>
                        )}
                        {/* Display Caption */}
                        <Card.Text className="post-caption">{post.caption}</Card.Text>
                    </Card.Body>

                    {/* Timestamp Footer */}
                    <Card.Footer className="post-footer">
                        {timestampToTimeAgo(new Date(post.datePosted))}
                    </Card.Footer>
                </Card>
            </Link>
        </div>
    );
}
