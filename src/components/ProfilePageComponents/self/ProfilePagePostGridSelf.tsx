"use client";

import { useState } from "react";
import { Post, Media } from "@/lib/db/models";
import { Container, Col, Row, CloseButton, Card, Button } from "react-bootstrap";

import ProfilePagePost from "../ProfilePagePost";


interface ProfilePagePostGridSelfProps {
    postData: { post: Post, media: Media[] }[]; 
    className?: string;
}

export default function ProfilePagePostGridSelf({ postData, className }: ProfilePagePostGridSelfProps) {
    const [posting, setPosting] = useState(false);

    postData.sort((a: any, b: any) => {
        return new Date(b.post.datePosted).getTime() - new Date(a.post.datePosted).getTime();
    });

    return (
        <Container fluid className={className} style={{ marginLeft: '250px', paddingTop: '60px' }}> {/* Adjust margin for the vertical navbar */}
            <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                    
                </Col>
                {postData.slice(0, 3).map((pd: any, index: number) => (
                    <Col key={index} xs={12} sm={6} md={4} lg={3}>
                        <ProfilePagePost post={pd.post} thumbnail={pd.media[0]} />
                    </Col>
                ))}
            </Row>
            {postData.length > 0 &&
                postData.slice(3).map((pd: any, index: number) => {
                    if (index % 4 === 0) {
                        return (
                            <Row key={index}>
                                {postData.slice(3).slice(index, index + 4).map((subPd: any, subIndex: number) => (
                                    <Col key={subIndex} xs={12} sm={6} md={4} lg={3}>
                                        <ProfilePagePost post={subPd.post} thumbnail={subPd.media[0]} />
                                    </Col>
                                ))}
                            </Row>
                        );
                    }
                    return null; // Avoid returning undefined in the loop
                })
            }
        </Container>
    );
}
