import { render, screen } from "@testing-library/react";
import LoginForm from "@/components/forms/LoginForm";
import "@testing-library/jest-dom";

describe("LoginForm Rendering", () => {
  test("renders the header with welcome text", () => {
    render(<LoginForm />);
    expect(screen.getByText(/Welcome to Bingus/i)).toBeInTheDocument();
  });
  test("renders 'Don't have an account?' text", () => {
    render(<LoginForm />);
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
  });

  test("renders 'Register' link with correct URL", () => {
    render(<LoginForm />);
    const registerLink = screen.getByRole("link", { name: /Register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register"); // Adjust href based on your component
  });
  test("renders the email input field", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  });

  test("renders the password input field", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  test("renders the login button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });
});
