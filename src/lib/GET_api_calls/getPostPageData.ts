import { Post, PostVote, PostComment, CommentReply, CommentVote, UserProfile, Media } from "../db/models";

interface ReturnData {
    post: Post;
    user: UserProfile;
    media: Media[];
    voteCount: number,
    userVote: PostVote | null
}

export default async function getPostPageData(postId: number, userId: number): Promise<ReturnData> {
    const postResponse = await fetch(`http://localhost:3000/api/crud/posts/${postId}`);
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

    return { post, user, media, voteCount, userVote };
}