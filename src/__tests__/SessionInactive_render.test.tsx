import React from "react";
import { render, screen } from "@testing-library/react";
import SessionInactive from "../components/SessionInactive";

describe("SessionInactive Component", () => {
  test("renders session inactive message", () => {
    render(<SessionInactive />);
    const message = screen.getByText(/session is inactive\./i);
    expect(message).toBeInTheDocument();
  });

  test("renders a link to the home page", () => {
    render(<SessionInactive />);
    const homeLink = screen.getByRole("link", { name: /go to home page\./i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("renders a link to the login page", () => {
    render(<SessionInactive />);
    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("renders a link to the register page", () => {
    render(<SessionInactive />);
    const registerLink = screen.getByRole("link", { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });
});
