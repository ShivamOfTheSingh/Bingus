// Import necessary libraries
import React from "react";
import { render, screen } from "@testing-library/react";
import Inbox from "../components/InboxComponents/Inbox";
import Message from "../components/InboxComponents/Message";

// Mock Data based on the provided database schema
const mockMessages = [
  {
    messages_id: 1,
    chat_id: 1,
    user_id: 1,
    messages_text: "Hello, how are you?",
    messages_timestamp: "2024-12-01T12:00:00Z",
  },
  {
    messages_id: 2,
    chat_id: 1,
    user_id: 2,
    messages_text: "I'm good, thank you!",
    messages_timestamp: "2024-12-01T12:05:00Z",
  },
];

jest.mock("../components/InboxComponents/Message", () => {
  return function MockMessage({ messages_text, messages_timestamp }) {
    return (
      <div data-testid="message">
        <span>{messages_text}</span>
        <span>{new Date(messages_timestamp).toLocaleString()}</span>
      </div>
    );
  };
});

describe("Inbox Component", () => {
  test("renders messages container", () => {
    render(<Inbox messages={mockMessages} />);

    // Check if the messages container is rendered
    const messageListContainer = screen.getByTestId("message-list-container");
    expect(messageListContainer).toBeInTheDocument();
  });

  test("renders individual messages using Message component", () => {
    render(<Inbox messages={mockMessages} />);

    // Check if individual messages are rendered
    const messages = screen.getAllByTestId("message");
    expect(messages).toHaveLength(mockMessages.length);

    // Check content of each message
    mockMessages.forEach((message, index) => {
      expect(messages[index]).toHaveTextContent(message.messages_text);
      expect(messages[index]).toHaveTextContent(
        new Date(message.messages_timestamp).toLocaleString()
      );
    });
  });

  test("renders input field", () => {
    render(<Inbox />);

    // Check for input field
    const inputField = screen.getByPlaceholderText("Type a message");
    expect(inputField).toBeInTheDocument();
  });

  test("renders send button", () => {
    render(<Inbox />);

    // Check for send button
    const sendButton = screen.getByRole("button", { name: /send/i });
    expect(sendButton).toBeInTheDocument();
  });
});
