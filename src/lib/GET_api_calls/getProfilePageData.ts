import { notFound } from "next/navigation";
import { UserProfile, Post, Media, UserSettings } from "../db/models";

interface ReturnData {
  profile: UserProfile;
  numPosts: number;
  numFollowing: number;
  numFollowers: number;
  posts: { post: Post, media: Media[] }[];
  settings: UserSettings;
}

/**
 * Function to get data for the profile page by user profile id.
 * 
 * @param {number} userId The user profile ID.
 * @returns {ReturnData} An object containing the user profile info, number of followers, 
 *                       and an array of objects that each contain a post and an array of that post's media.
 */
export default async function getProfilePageData(userId: number): Promise<ReturnData> {
  const resProfile = await fetch(`https://bingus.website/api/crud/user_profile/${userId}`);
  if (resProfile.status === 404) notFound();
  const profile: UserProfile = await resProfile.json();

  const resPosts = await fetch(`https://bingus.website/api/crud/user_profile/posts/${userId}`);
  const posts: Post[] = await resPosts.json();

  const postsWithMedia: { post: Post, media: Media[] }[] = [];
  for (let i = 0; i < posts.length; i++) {
    const resMedia = await fetch(`https://bingus.website/api/crud/posts/media/${posts[i].postId}`);
    const mediaArray: Media[] = await resMedia.json();
    postsWithMedia.push({
      post: posts[i],
      media: mediaArray
    });
  }

  const resFollowers = await fetch(`https://bingus.website/api/crud/followings/numFollowers/${userId}`);
  const numFollowers = await resFollowers.json();

  const resFollowing = await fetch(`https://bingus.website/api/crud/followings/numFollowing/${userId}`);
  const numFollowing = await resFollowing.json();

  const resSettings = await fetch(`https://bingus.website/api/crud/user_settings/user/${userId}`);
  if (resSettings.status === 404) notFound();
  const settings: UserSettings = await resSettings.json();

  return {
    profile: profile,
    numPosts: posts.length,
    numFollowers: numFollowers.count,
    numFollowing: numFollowing.count,
    posts: postsWithMedia,
    settings: settings
  };
}
