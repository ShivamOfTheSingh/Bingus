"use client";

import { useMemo } from "react";
import { Container } from "react-bootstrap"; // Only need Container for layout
import MainFeedPost from "./MainFeedPost"; // Import the MainFeedPost component
import { PostsList, SinglePost } from "@/lib/GET_api_calls/getFeedData"; // Correct import path for PostsList and SinglePost

interface MainFeedListSelfProps {
  postData: PostsList; // postData is now of type PostsList
  className?: string;
}

export default function MainFeedList({ postData, className }: MainFeedListSelfProps) {
  // Ensure that postData is an object with the 'posts' array, and then process it
  const sortedPosts = useMemo(() => {
    if (!postData || !Array.isArray(postData.posts)) {
      console.error("Expected postData.posts to be an array, but received:", postData);
      return []; // Return an empty array if the posts property is not an array
    }

    return postData.posts
      .flatMap((singlePost: SinglePost) =>
        singlePost.posts.map((post) => ({
          profile: singlePost.profile,
          post: post.post,
          media: post.media,
        }))
      )
      .sort((a, b) => new Date(b.post.datePosted).getTime() - new Date(a.post.datePosted).getTime());
  }, [postData]);

  return (
    <Container fluid className={className} style={{ paddingTop: '60px' }}>
      {/* Render posts as a list */}
      <div>
        {sortedPosts.map((pd, index) => (
          <div key={index} style={{ marginBottom: '40px' }}>
            {/* Pass the required props to MainFeedPost */}
            <MainFeedPost 
              post={pd.post} 
              userProfileImage={pd.profile.profilePicture} 
              userName={`${pd.profile.firstName} ${pd.profile.lastName}`} 
              userUsername={pd.profile.username}
              media={pd.media[0]} 
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
