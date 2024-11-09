import { notFound } from "next/navigation";
import { Post, PostVote, PostComment, CommentReply, CommentVote, UserProfile, Media } from "../db/models";

interface ReturnData {
    post: Post;
    user: UserProfile;
    media: Media[];
    voteCount: number;
    userVote: PostVote | null;
    commentsWithReplies: { user: UserProfile, userVote: CommentVote, voteCount: number, comment: PostComment, replies: { reply: CommentReply, user: UserProfile }[] }[];
    userSelf: UserProfile;
}

export default async function getPostPageData(postId: number, userId: number): Promise<ReturnData> {
    const postResponse = await fetch(`http://localhost:3000/api/crud/posts/${postId}`);

    if (postResponse.status === 404) notFound();

    const mediaResponse = await fetch(`http://localhost:3000/api/crud/posts/media/${postId}`);
    const votesResponse = await fetch(`http://localhost:3000/api/crud/posts/voteCounts/${postId}`);
    const post: Post = await postResponse.json();
    const media: Media[] = await mediaResponse.json();
    const voteCountObject = await votesResponse.json();
    const voteCount: number = voteCountObject.count;
    
    const userVoteResponse = await fetch(`http://localhost:3000/api/crud/post_vote/user_post_pair?userId=${userId}&postId=${postId}`);
    let userVote;
    if (userVoteResponse.status === 404) {
        userVote = null;
    }
    else {
        userVote = await userVoteResponse.json();
    }

    const userResponse = await fetch(`http://localhost:3000/api/crud/user_profile/${post.userId}`);
    const user: UserProfile = await userResponse.json();

    const commentsResponse = await fetch(`http://localhost:3000/api/crud/posts/comments/${post.postId}`);
    const comments: PostComment[] = await commentsResponse.json();

    const commentsWithReplies: { user: UserProfile, userVote: CommentVote, voteCount: number, comment: PostComment, replies: { reply: CommentReply, user: UserProfile }[] }[] = [];
    for (let i = 0; i < comments.length; i++) {
        const repliesResponse = await fetch(`http://localhost:3000/api/crud/post_comment/replies/${comments[i].postCommentId}`);
        const userResponse = await fetch(`http://localhost:3000/api/crud/user_profile/${comments[i].userId}`);
        const votesResponse = await fetch(`http://localhost:3000/api/crud/post_comment/voteCounts/${comments[i].postCommentId}`);
        const userVoteResponse = await fetch(`http://localhost:3000/api/crud/comment_vote/user_comment_pair?userId=${userId}&postCommentId=${comments[i].postCommentId}`);
        let userVote;
        if (userVoteResponse.status === 404) {
            userVote = null;
        }
        else {
            userVote = await userVoteResponse.json();
        }
        const voteCountObject = await votesResponse.json();
        const voteCount: number = voteCountObject.count;
        const replies: CommentReply[] = await repliesResponse.json();
        
        const replyObjects: { reply: CommentReply, user: UserProfile }[] = [];
        for (let j = 0; j < replies.length; j++) {
            const replyUserResponse = await fetch(`http://localhost:3000/api/crud/user_profile/${replies[j].userId}`);
            const replyUser: UserProfile = await replyUserResponse.json();
            replyObjects.push({
                reply: replies[j],
                user: replyUser
            });
        }

        const user: UserProfile = await userResponse.json();
        commentsWithReplies.push({
            user: user,
            userVote: userVote,
            voteCount: voteCount,
            comment: comments[i],
            replies: replyObjects
        });
    }

    const userSelfResponse = await fetch(`http://localhost:3000/api/crud/user_profile/${userId}`);
    const userSelf: UserProfile = await userSelfResponse.json();

    return { post, user, media, voteCount, userVote, commentsWithReplies, userSelf };
}