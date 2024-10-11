import { notFound } from "next/navigation";
import { UserProfile, Post, Media } from "../db/models";

interface ReturnData {
  profile: UserProfile;
  numPosts: number;
  posts: { post: Post, media: Media[] }[];
}

/**
 * Function to get data for the profile page by user profile id.
 * 
 * @param {number} userId The user profile ID.
 * @returns {ReturnData} An object containing the user profile info, number of followers, 
 *                       and an array of objects that each contain a post and an array of that post's media.
 */
export default async function getProfilePageData(userId: number): Promise<ReturnData> {
    console.log("getProfilePageData: before resProfile fetch");
    const resProfile = await fetch(`http://localhost:3000/api/crud/user_profile/${userId}`);
    if (resProfile.status === 404) notFound();
    console.log("getProfilePageData: before resProfile.json");
    const profile: UserProfile = await resProfile.json();

    console.log("getProfilePageData: before resPosts fetch");
    const resPosts = await fetch(`http://localhost:3000/api/crud/user_profile/posts/${userId}`);
    console.log("getProfilePageData: before resPosts.json");
    const posts: Post[] = await resPosts.json();

    const postsWithMedia: { post: Post, media: Media[] }[] = [];
    for (let i = 0; i < posts.length; i++) {
      console.log("getProfilePageData: before resMedia fetch");
      const resMedia = await fetch(`http://localhost:3000/api/crud/posts/media/${posts[i].postId}`);
      console.log(`resMedia response ${i}`, resMedia);
      console.log("getProfilePageData: before resMedia JSon");
      const mediaArray: Media[] = await resMedia.json();
      postsWithMedia.push({
        post: posts[i],
        media: mediaArray
      });
    }
    console.log("getProfilePageData: before return: ", postsWithMedia);
    return {
      profile: profile,
      numPosts: posts.length,
      posts: postsWithMedia
    };
}
