import { notFound } from "next/navigation";
import { UserProfile, Post, Media } from "../db/models";

export interface SinglePost {
  profile: UserProfile;
  posts: { post: Post; media: Media[] }[];
}

export interface PostsList {
  posts: SinglePost[];
}

export default async function getFeedData(): Promise<PostsList> {
  console.log("Fetching feed data...");

  // Fetch all user profiles
  const users = await fetch('https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_profile').then(res => res.json());

  const postsList: PostsList = { posts: [] };

  // Loop over users to fetch their profiles and posts with media
  for (const user of users) {
    const userId = user.userId;
    console.log(`Fetching posts for user ID: ${userId}`);

    // Fetch posts for the user
    const resPosts = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_profile/posts/${userId}`);
    const posts: Post[] = await resPosts.json();

    const postsWithMedia: { post: Post; media: Media[] }[] = [];

    // Fetch media for each post and combine post data with its media
    for (let i = 0; i < posts.length; i++) {
      const resMedia = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/posts/media/${posts[i].postId}`);
      const mediaArray: Media[] = await resMedia.json();
      postsWithMedia.push({
        post: posts[i],
        media: mediaArray,
      });
    }

    // Fetch user profile for the current user
    const resProfile = await fetch(`https://production.d3drl1bcjmxovs.amplifyapp.com/api/crud/user_profile/${userId}`);
    if (resProfile.status === 404) {
      notFound(); // Handle 404 error for missing profile
    }
    const profile: UserProfile = await resProfile.json();

    // Create the SinglePost object containing the profile and posts
    const singlePost: SinglePost = {
      profile: profile,
      posts: postsWithMedia,
    };

    // Add the single post (profile + posts with media) to the postsList
    postsList.posts.push(singlePost);
  }

  // Return the list of all users with their profiles and posts with media
  return postsList;
}
