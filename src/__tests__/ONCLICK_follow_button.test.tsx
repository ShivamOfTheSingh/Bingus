import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import FollowButton from '@/components/ProfilePageComponents/FollowButton';  // Ensure the path is correct
import { followUser, unfollowUser } from '@/lib/GET_api_calls/followUser';  // Ensure the path is correct
import { Following } from '@/lib/db/models';  // Ensure the path is correct
import '@testing-library/jest-dom'; // Import for custom jest matchers like toHaveTextContent

// Mock the follow/unfollow functions
jest.mock('../lib/GET_api_calls/followUser', () => ({
  followUser: jest.fn(),
  unfollowUser: jest.fn(),
}));

describe('FollowButton', () => {
    const mockFollowing: Following = {
        userId: 1,
        followedUserId: 2,
        followingId: undefined,  // This will trigger the "follow" scenario
    };

    const mockUnfollow: Following = {
        userId: 1,
        followedUserId: 2,
        followingId: 123,  // This will trigger the "unfollow" scenario
    };

    beforeEach(() => {
        jest.clearAllMocks();  // Reset mocks before each test
    });

    it('should call followUser and update the state correctly when following a user', async () => {
        // Arrange: Set up the mock response for followUser
        const mockFollowResponse = { ...mockFollowing, followingId: 456 };
        (followUser as jest.Mock).mockResolvedValue(mockFollowResponse);

        render(<FollowButton following={mockFollowing} />);  // Use JSX syntax for rendering

        // Act: Simulate the button click to follow
        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Wait for the loading state to finish
        await waitFor(() => expect(button).toHaveTextContent('Unfollow'));

        // Assert: Verify that followUser was called and the state was updated
        expect(followUser).toHaveBeenCalledWith(mockFollowing.userId, mockFollowing.followedUserId);
        expect(button).toHaveTextContent('Unfollow');
    });

    it('should call unfollowUser and update the state correctly when unfollowing a user', async () => {
        // Arrange: Set up the mock response for unfollowUser
        (unfollowUser as jest.Mock).mockResolvedValue({});

        render(<FollowButton following={mockUnfollow} />);  // Use JSX syntax for rendering

        // Act: Simulate the button click to unfollow
        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Wait for the loading state to finish
        await waitFor(() => expect(button).toHaveTextContent('Follow'));

        // Assert: Verify that unfollowUser was called and the state was updated
        expect(unfollowUser).toHaveBeenCalledWith(mockUnfollow.followingId);
        expect(button).toHaveTextContent('Follow');
    });

    it('should display loading text while the request is in progress', async () => {
        // Arrange: Set up the mock response for followUser with a delayed promise
        const mockFollowResponse = { ...mockFollowing, followingId: 456 };
        (followUser as jest.Mock).mockResolvedValue(mockFollowResponse);

        render(<FollowButton following={mockFollowing} />);  // Use JSX syntax for rendering

        // Act: Simulate the button click to follow
        const button = screen.getByRole('button');
        fireEvent.click(button);

        // Assert: Verify that the button text changes to "Loading..."
        expect(button).toHaveTextContent('Loading...');

        // Wait for the loading to finish and the button text to change
        await waitFor(() => expect(button).toHaveTextContent('Unfollow'));
    });
});
