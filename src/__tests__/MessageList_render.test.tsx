// Import necessary libraries for testing
import React from "react";
import { render, screen, act } from "@testing-library/react";
import MessageList from "@/components/InboxComponents/MessageList";

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProfiles), // Ensure fetch returns mockProfiles
    })
  );
});

afterEach(() => {
  global.fetch.mockRestore();
});

// Mock profiles for testing
const mockProfiles = [
  { id: 1, username: "user1" },
  { id: 2, username: "user2" },
  { id: 3, username: "user3" },
];

describe("MessageList Component", () => {
  test("renders the username", async () => {
    await act(async () => {
      render(
        <MessageList 
          username="currentUser"
          currentUserId={123}
          profiles={mockProfiles} 
        />
      );
    });

    expect(screen.getByText("currentUser")).toBeInTheDocument();
  });

  test("renders the search bar", async () => {
    await act(async () => {
      render(
        <MessageList 
          username="currentUser"
          currentUserId={123}
          profiles={mockProfiles} 
        />
      );
    });

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  test("renders profiles from the list", async () => {
    await act(async () => {
      render(
        <MessageList 
          username="currentUser"
          currentUserId={123}
          profiles={mockProfiles} 
        />
      );
    });

    mockProfiles.forEach((profile) => {
      expect(screen.getByText(profile.username)).toBeInTheDocument();
    });
  });

  test("renders fallback message when no profiles are provided", async () => {
    await act(async () => {
      render(
        <MessageList 
          username="currentUser"
          currentUserId={123}
          profiles={[]} 
        />
      );
    });

    expect(screen.getByText(/no chats available/i)).toBeInTheDocument();
  });
});
