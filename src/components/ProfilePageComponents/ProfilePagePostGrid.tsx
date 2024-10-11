"use client";

import { useState } from "react";
import { Post, Media } from "@/lib/db/models";
import { Container, Col, Row, CloseButton, Card, Button } from "react-bootstrap";
import NewPostForm from "../forms/NewPostForm";
import ProfilePagePost from "./ProfilePagePost";

interface ProfilePagePostGridProps {
    postData: { post: Post, media: Media[] }[];
    className?: string;
}

export default function ProfilePagePostGrid({ postData, className }: ProfilePagePostGridProps) {
    const [posting, setPosting] = useState(false);

    return (
        <Container>
            <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                    { posting ?
                        <div>
                            <CloseButton onClick={() => { setPosting(false) }} />
                            <NewPostForm />
                        </div>
                        :
                        <Card className="w-72 h-80 flex justify-center items-center">
                            <Button size="lg" variant="secondary" onClick={() => { setPosting(true) }}>
                                New Post
                            </Button>
                        </Card>
                    }
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
                })
            }
        </Container>
    );
}