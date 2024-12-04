"use server";

import CommentSection from "@/components/Post/CommentSection";
import PostComponent from "@/components/Post/PostComponent";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import getPostPageData from "@/lib/GET_api_calls/getPostPageData";
import { redirect } from "next/navigation";
import { Col, Row, Container } from "react-bootstrap";


import '@/public/PostPage.css'

export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    const { post, user, media, voteCount, userVote, commentsWithReplies, userSelf } = await getPostPageData(parseInt(params.id), userId);

    return (
        <Container className="post-page-container">
            <Row className="post-container">
                {/* Post and Comments side-by-side */}
                <Col md={8} className="post-left">
                    <PostComponent
                        post={post}
                        media={media}
                        user={user}
                        voteCount={voteCount}
                        userVote={userVote}
                        userIdSelf={userId}
                    />
                </Col>
                <Col md={4} className="post-right">
                    <CommentSection
                        commentsWithReplies={commentsWithReplies}
                        postId={post.postId || -1}
                        userSelf={userSelf}
                    />
                </Col>
            </Row>
        </Container>
    );
}
