// Import necessary libraries
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FollowCardOther from "../components/Followers/FollowCardOther";
import FollowCardSelf from "../components/Followers/FollowCardSelf";

// Mock Data
const mockOtherProfile = {
  userId: 2,
  username: "other_user",
  profilePicture: "/profile-other.jpg",
  isFollowing: false,
};

const mockSelfProfile = {
  userId: 1,
  username: "self_user",
  profilePicture: "/profile-self.jpg",
  followerCount: 100,
  followingCount: 50,
};

const mockFollowing = {
  followingId: 1,
};

describe("FollowCardOther Component", () => {
  test("renders other user's profile picture and username", () => {
    render(<FollowCardOther profile={mockOtherProfile} />);

    const profileImage = screen.getByAltText(`@${mockOtherProfile.username}'s profile`);
    expect(profileImage).toHaveAttribute("src", mockOtherProfile.profilePicture);

    const username = screen.getByText(`@${mockOtherProfile.username}`);
    expect(username).toBeInTheDocument();
  });

  test("renders follow button for other user", () => {
    render(<FollowCardOther profile={mockOtherProfile} />);

    const followButton = screen.getByRole("button", { name: /follow/i });
    expect(followButton).toBeInTheDocument();
  });

  test("follow button toggles to unfollow on click", () => {
    render(<FollowCardOther profile={mockOtherProfile} />);

    const followButton = screen.getByRole("button", { name: /follow/i });
    fireEvent.click(followButton);
    expect(followButton).toHaveTextContent(/unfollow/i);
  });
});

describe("FollowCardSelf Component", () => {
  test("renders self user's profile picture, username, and stats", () => {
    render(<FollowCardSelf profile={mockSelfProfile} />);

    const profileImage = screen.getByAltText(`@${mockSelfProfile.username}'s profile`);
    expect(profileImage).toHaveAttribute("src", mockSelfProfile.profilePicture);

    const username = screen.getByText(`@${mockSelfProfile.username}`);
    expect(username).toBeInTheDocument();

    const followerCount = screen.getByText(`${mockSelfProfile.followerCount} Followers`);
    expect(followerCount).toBeInTheDocument();

    const followingCount = screen.getByText(`${mockSelfProfile.followingCount} Following`);
    expect(followingCount).toBeInTheDocument();
  });

  test("renders edit profile button", () => {
    render(<FollowCardSelf profile={mockSelfProfile} />);

    const editProfileButton = screen.getByRole("button", { name: /edit profile/i });
    expect(editProfileButton).toBeInTheDocument();
  });

  test("edit profile button triggers edit event", () => {
    const onEditProfileMock = jest.fn();
    render(<FollowCardSelf profile={mockSelfProfile} onEditProfile={onEditProfileMock} />);

    const editProfileButton = screen.getByRole("button", { name: /edit profile/i });
    fireEvent.click(editProfileButton);
    expect(onEditProfileMock).toHaveBeenCalled();
  });
});
