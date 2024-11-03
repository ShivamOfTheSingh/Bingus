"use server";

import CommentSection from "@/components/Post/CommentSection";
import PostComponent from "@/components/Post/Post";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import getPostPageData from "@/lib/GET_api_calls/getPostPageData";
import { redirect } from "next/navigation";
import { Col, Row, Container } from "react-bootstrap";

export default async function Page({ params }: { params: { id: string } }) {
    const userId = await getCurrentSessionUserId();
    if (userId === -1) {
        redirect("/login");
    }

    const { post, user, media, voteCount, userVote, commentsWithReplies } = await getPostPageData(parseInt(params.id), userId);
    return (
        <div>
            <PostComponent post={post} media={media} user={user} voteCount={voteCount} userVote={userVote} userIdSelf={userId} />
            <CommentSection commentsWithReplies={commentsWithReplies} postId={post.postId || -1} userId={userId} />
        </div>
    );
}