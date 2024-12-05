import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { POST } from "@/app/api/session/login/route";
import pool from "@/lib/db/pool";
import { encrypt } from "@/lib/utils/objectEncryption";

jest.mock("../lib/db/pool");
jest.mock("bcrypt");
jest.mock("../lib/utils/objectEncryption");
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("POST login API", () => {
  let mockClient: any;
  let mockSetCookie: jest.Mock;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);

    mockSetCookie = jest.fn();
    (cookies as jest.Mock).mockReturnValue({ set: mockSetCookie });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login a user and create a session", async () => {
    const mockUserData = {
      email: "user@example.com",
      password: "password123",
    };

    const mockRequest = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(mockUserData),
    });

    mockClient.query
      .mockResolvedValueOnce({
        rows: [
          {
            email: "user@example.com",
            user_password: "hashedPassword",
            user_auth_id: 123,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            public_session_id: "session-id-123",
          },
        ],
      });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (encrypt as jest.Mock).mockReturnValue("encrypted-session");

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);
    expect(response.text()).resolves.toBe("Logged in");
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockSetCookie).toHaveBeenCalledWith("session", "encrypted-session", {
      httpOnly: true,
      secure: true,
      expires: expect.any(Date),
      path: "/",
    });
  });

  it("should return 401 for invalid password", async () => {
    const mockUserData = {
      email: "user@example.com",
      password: "wrongpassword",
    };

    const mockRequest = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(mockUserData),
    });

    mockClient.query.mockResolvedValue({
      rows: [
        {
          email: "user@example.com",
          user_password: "hashedPassword",
          user_auth_id: 123,
        },
      ],
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await POST(mockRequest);

    expect(response.status).toBe(401);
    expect(response.text()).resolves.toBe("Invalid email/password");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });

  it("should return 404 for non-existent email", async () => {
    const mockUserData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    const mockRequest = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(mockUserData),
    });

    mockClient.query.mockResolvedValue({ rows: [] });

    const response = await POST(mockRequest);

    expect(response.status).toBe(404);
    expect(response.text()).resolves.toBe("Invalid email/password");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });

  it("should return 500 for internal server error", async () => {
    const mockUserData = {
      email: "user@example.com",
      password: "password123",
    };

    const mockRequest = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify(mockUserData),
    });

    mockClient.query.mockRejectedValue(new Error("Database error"));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(response.text()).resolves.toBe("Internal server error");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });
});
