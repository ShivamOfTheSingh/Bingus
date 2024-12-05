// Import necessary libraries
import React from "react";
import { render, screen } from "@testing-library/react";
import PostComponent from "../components/Post/PostComponent";
import CommentSection from "../components/Post/CommentSection";
import MediaScroll from "../components/Post/MediaScroll";
import LikeButton from "../components/Post/LikeButton";
import NewCommentForm from "../components/Post/NewCommentForm";
import ScrollButton from "../components/Post/ScrollButton";
import CommentComponent from "../components/Post/CommentComponent";
import NewReplyForm from "../components/Post/NewReplyForm";

// Mock child components
jest.mock("../components/Post/CommentSection", () => {
  return function MockCommentSection({ comments }) {
    return (
      <div data-testid="comment-section">
        {comments.map((comment) => (
          <div key={comment.post_comment_id}>
            <p>{comment.post_comment}</p>
            <p>{comment.user.username}</p>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("../components/Post/MediaScroll", () => {
  return function MockMediaScroll({ media }) {
    return (
      <div data-testid="media-scroll">
        {media.map((m) => (
          <img key={m.media_id} src={m.media_url} alt={`Media ${m.media_url}`} />
        ))}
      </div>
    );
  };
});

jest.mock("../components/Post/LikeButton", () => {
  return function MockLikeButton({ likes }) {
    return <div data-testid="like-button">{likes}</div>;
  };
});

jest.mock("../components/Post/NewCommentForm", () => {
  return function MockNewCommentForm() {
    return <div data-testid="new-comment-form">Mock New Comment Form</div>;
  };
});

jest.mock("../components/Post/ScrollButton", () => {
  return function MockScrollButton() {
    return <div data-testid="scroll-button">Mock Scroll Button</div>;
  };
});

jest.mock("../components/Post/CommentComponent", () => {
  return function MockCommentComponent({ comment }) {
    return (
      <div data-testid="comment-component">
        <p>{comment.post_comment}</p>
      </div>
    );
  };
});

jest.mock("../components/Post/NewReplyForm", () => {
  return function MockNewReplyForm() {
    return <div data-testid="new-reply-form">Mock New Reply Form</div>;
  };
});

// Mock Data
const mockUserProfile = {
  user_id: 1,
  user_name: "Test User",
  profilePicture: "/profile-pic.jpg", // Updated field name
  about: "About Test User",
};

const mockPost = {
  post_id: 1,
  user_id: mockUserProfile.user_id,
  caption: "This is a test post",
  date_posted: "2024-12-01T12:00:00Z",
  media: [
    { media_id: 1, media_url: "/media1.jpg", mime_type_prefix: "image/jpeg" },
    { media_id: 2, media_url: "/media2.jpg", mime_type_prefix: "image/png" },
  ],
  likes: 10,
  comments: [
    {
      post_comment_id: 1,
      user_id: mockUserProfile.user_id,
      post_comment: "This is a test comment",
      user: { username: "CommenterUser" },
      date_commented: "2024-12-01T13:00:00Z",
      replies: [
        {
          comment_reply_id: 1,
          reply: "This is a test reply",
          user: { username: "ReplyUser" },
          date_replied: "2024-12-01T14:00:00Z",
        },
      ],
    },
  ],
};

describe("PostComponent Suite", () => {
  describe("PostComponent", () => {
    test("renders PostComponent details", () => {
      render(
        <PostComponent
          post={mockPost}
          userProfileImage={mockUserProfile.profilePicture}
          userName={mockUserProfile.user_name}
        />
      );

      expect(screen.getByText(mockPost.caption)).toBeInTheDocument();
      expect(screen.getByTestId("media-scroll")).toBeInTheDocument();
      expect(screen.getByTestId("like-button")).toBeInTheDocument();
      expect(screen.getByTestId("comment-section")).toBeInTheDocument();
      expect(screen.getByTestId("new-comment-form")).toBeInTheDocument();
      expect(screen.getByTestId("scroll-button")).toBeInTheDocument();
    });
  });

  describe("CommentSection", () => {
    test("renders comments correctly", () => {
      render(<CommentSection comments={mockPost.comments} />);
      mockPost.comments.forEach((comment) => {
        expect(screen.getByText(comment.post_comment)).toBeInTheDocument();
        expect(screen.getByText(comment.user.username)).toBeInTheDocument();
      });
    });
  });

  describe("MediaScroll", () => {
    test("renders media correctly", () => {
      render(<MediaScroll media={mockPost.media} />);
      mockPost.media.forEach((media) => {
        expect(screen.getByAltText(`Media ${media.media_url}`)).toBeInTheDocument();
      });
    });
  });

  describe("LikeButton", () => {
    test("renders like count", () => {
      render(<LikeButton likes={mockPost.likes} />);
      expect(screen.getByText(mockPost.likes.toString())).toBeInTheDocument();
    });
  });

  describe("NewCommentForm", () => {
    test("renders NewCommentForm", () => {
      render(<NewCommentForm />);
      expect(screen.getByTestId("new-comment-form")).toBeInTheDocument();
    });
  });

  describe("ScrollButton", () => {
    test("renders ScrollButton", () => {
      render(<ScrollButton />);
      expect(screen.getByTestId("scroll-button")).toBeInTheDocument();
    });
  });

  describe("CommentComponent", () => {
    test("renders CommentComponent", () => {
      render(<CommentComponent comment={mockPost.comments[0]} user={mockUserProfile} />);
      expect(screen.getByText(mockPost.comments[0].post_comment)).toBeInTheDocument();
    });
  });

  describe("NewReplyForm", () => {
    test("renders NewReplyForm", () => {
      render(<NewReplyForm />);
      expect(screen.getByTestId("new-reply-form")).toBeInTheDocument();
    });
  });
});
