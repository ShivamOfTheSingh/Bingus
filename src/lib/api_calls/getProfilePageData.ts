import { UserProfile, Post, Media } from "../db/models";

export default async function getProfilePageData(userId: number) {
    const resProfile = await fetch(`http://localhost:3000/api/crud/user_profile/${userId}`);
    const profile: UserProfile = await resProfile.json();

    const resPosts = await fetch(`http://localhost:3000/api/crud/user_profile/posts/${userId}`);
    const posts: Post[] = await resPosts.json();

    const postsWithMedia: { post: Post, media: Media[] }[] = [];
    for (let i = 0; i < posts.length; i++) {
      const resMedia = await fetch(`http://localhost:3000/api/crud/posts/media/${posts[i].postId}`);
      const mediaArray: Media[] = await resMedia.json();
      postsWithMedia.push({
        post: posts[i],
        media: mediaArray
      });
    }

    return {
      profile: profile,
      numPosts: posts.length,
      posts: postsWithMedia
    };
}