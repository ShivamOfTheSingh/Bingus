"use client";

import { Post, Media } from "@/lib/db/models";
import { Col, Container, Row } from "react-bootstrap";
import ProfilePagePost from "../ProfilePagePost";

interface ProfilePagePostGridOtherProps {
    postData: { post: Post, media: Media[] }[];
    className?: string;
}

export default function ProfilePagePostGridOther({ postData, className }: ProfilePagePostGridOtherProps) {
    return (
        <Container>
            {postData.length > 0 && 
                postData.map((pd: any, index: number) => {
                    if (index % 4 === 0) {
                        return (
                            <Row key={index}>
                                {postData.slice(index, index + 4).map((subPd: any, subIndex: number) => (
                                    <Col key={subIndex} xs={12} sm={6} md={4} lg={3}>
                                        <ProfilePagePost post={subPd.post} thumbnail={subPd.media[0]} />
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