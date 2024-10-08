import { UserProfile, Post, Media } from "../db/models";

/**
 * Function to get data for the profile page by user profile id.
 * 
 * @param {number} userId The user profile ID.
 * @returns {ReturnData} An object containing the user profile info, number of followers, 
 *                       and an array of objects that each contain a post and an array of that post's media.
 */

interface ReturnData {
  profile: UserProfile;
  numPosts: number;
  posts: { post: Post, media: Media[] }[];
}

export default async function getProfilePageData(userId: number): Promise<ReturnData> {
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