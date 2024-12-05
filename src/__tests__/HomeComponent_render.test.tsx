import React from "react";
import { render, screen } from "@testing-library/react";
import MainFeedList from "../components/HomeComponents/MainFeedList";
import MainFeedPost from "../components/HomeComponents/MainFeedPost";

// Mock MainFeedPost
jest.mock("../components/HomeComponents/MainFeedPost", () => {
  return function MockMainFeedPost({ post }) {
    return (
      <div data-testid="main-feed-post">
        <img src={post.userProfileImage} alt={post.userName} data-testid="profile-image" />
        <h3>{post.userName}</h3>
        <p>@{post.userUsername}</p>
        <p>{post.content}</p>
        {post.media && <img src={post.media.url} alt={post.media.alt} data-testid="post-media" />}
      </div>
    );
  };
});

// Mock Data
const mockPostData = [
  { id: 1, title: "Post 1", content: "Content 1", userProfileImage: "image1.jpg", userName: "User 1", userUsername: "user1", media: { url: "media1.jpg", alt: "Media 1" } },
  { id: 2, title: "Post 2", content: "Content 2", userProfileImage: "image2.jpg", userName: "User 2", userUsername: "user2", media: { url: "media2.jpg", alt: "Media 2" } },
  { id: 3, title: "Post 3", content: "Content 3", userProfileImage: "image3.jpg", userName: "User 3", userUsername: "user3", media: null },
];

describe("MainFeedList Component", () => {
  test("renders the container", () => {
    render(<MainFeedList postData={mockPostData} className="custom-class" />);
    const container = screen.getByTestId("main-feed-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("custom-class");
  });

  test("renders a MainFeedPost for each post in postData", () => {
    render(<MainFeedList postData={mockPostData} />);
    const posts = screen.getAllByTestId("main-feed-post");
    expect(posts).toHaveLength(mockPostData.length);
  });

  test("renders nothing when postData is empty", () => {
    render(<MainFeedList postData={[]} />);
    const posts = screen.queryAllByTestId("main-feed-post");
    expect(posts).toHaveLength(0);
  });

  test("renders nothing when postData is undefined", () => {
    render(<MainFeedList postData={undefined} />);
    const posts = screen.queryAllByTestId("main-feed-post");
    expect(posts).toHaveLength(0);
  });
});

describe("MainFeedPost Component", () => {
  test("renders all elements of a post", () => {
    const mockPost = mockPostData[0];
    render(<MainFeedPost post={mockPost} />);
    expect(screen.getByTestId("profile-image")).toHaveAttribute("src", mockPost.userProfileImage);
    expect(screen.getByTestId("profile-image")).toHaveAttribute("alt", mockPost.userName);
    expect(screen.getByText(mockPost.userName)).toBeInTheDocument();
    expect(screen.getByText(`@${mockPost.userUsername}`)).toBeInTheDocument();
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
    const postMedia = screen.getByTestId("post-media");
    expect(postMedia).toHaveAttribute("src", mockPost.media.url);
    expect(postMedia).toHaveAttribute("alt", mockPost.media.alt);
  });

  test("renders without media when none is provided", () => {
    const mockPost = mockPostData[2];
    render(<MainFeedPost post={mockPost} />);
    const postMedia = screen.queryByTestId("post-media");
    expect(postMedia).not.toBeInTheDocument();
  });
});
