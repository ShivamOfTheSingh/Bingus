// Import necessary libraries
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar2 from "../components/Navbar2";
import { useRouter, usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faComment,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// Mock Next.js navigation methods
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockUseRouter = jest.requireMock("next/navigation").useRouter;
const mockUsePathname = jest.requireMock("next/navigation").usePathname;

describe("NavBar2 Component", () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    });
    mockUsePathname.mockReturnValue("/profile");
  });

  test("renders branding correctly", () => {
    render(<NavBar2 />);

    const branding = screen.getByText("Bingus");
    expect(branding).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<NavBar2 />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    const messagesLink = screen.getByRole("link", { name: /messages/i });
    expect(messagesLink).toBeInTheDocument();
    expect(messagesLink).toHaveAttribute("href", "/conversations");

    const postLink = screen.getByRole("link", { name: /post/i });
    expect(postLink).toBeInTheDocument();
    expect(postLink).toHaveAttribute("href", "/post");

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute("href", "/profile");
  });

  test("highlights the active link", () => {
    render(<NavBar2 />);

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).toHaveClass("active");
  });

  test("renders user profile picture", () => {
    render(<NavBar2 />);

    const profileImage = screen.getByAltText(/profile/i);
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src", "https://via.placeholder.com/50");
  });

  test("calls logout function when logout is clicked", () => {
    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({
      push: pushMock,
    });

    render(<NavBar2 />);

    const logoutButton = screen.getByRole("link", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
