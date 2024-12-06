"use client";

import { Post, Media } from "@/lib/db/models";
import { Col, Container, Row } from "react-bootstrap";
import ProfilePagePost from "./ProfilePagePost";
import { useEffect } from "react";

interface ProfilePagePostGridOtherProps {
    posts: Post[];
    className?: string;
}

export default function ProfilePagePostGrid({ posts, className }: ProfilePagePostGridOtherProps) {
    posts.sort((a: any, b: any) => {
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });

    return (
        <Container>
            {posts.length > 0 && 
                posts.map((p: Post, index: number) => {
                    if (index % 4 === 0) {
                        return (
                            <Row key={index}>
                                {posts.slice(index, index + 4).map((subP: Post, subIndex: number) => (
                                    <Col key={subIndex} xs={12} sm={6} md={4} lg={3}>
                                        <ProfilePagePost post={subP} />
                                    </Col>
                                ))}
                            </Row>
                        );
                    }
                })
            }
        </Container>
    );
}