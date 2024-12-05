import { cookies } from "next/headers";
import { PATCH } from "@/app/api/session/logout/route";
import pool from "@/lib/db/pool";
import { decrypt } from "@/lib/utils/objectEncryption";

jest.mock("../lib/db/pool");
jest.mock("../lib/utils/objectEncryption");
jest.mock("next/headers", () => ({ cookies: jest.fn() }));

describe("PATCH logout API", () => {
  let mockClient: any;
  let mockSetCookie: jest.Mock;
  let mockGetCookie: jest.Mock;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);

    mockSetCookie = jest.fn();
    mockGetCookie = jest.fn();
    (cookies as jest.Mock).mockReturnValue({
      set: mockSetCookie,
      get: mockGetCookie,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log out a user and clear the session cookie", async () => {
    const mockSession = "encrypted-session";
    const decryptedSession = {
      sessionId: "session-id-123",
      userAuthId: 123,
    };

    mockGetCookie.mockReturnValue({ value: mockSession });
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify(decryptedSession));

    mockClient.query
      .mockResolvedValueOnce({ rows: [{ session_id: 1 }] })
      .mockResolvedValueOnce({});

    const mockRequest = new Request("http://localhost/api/logout", {
      method: "PATCH",
    });

    const response = await PATCH(mockRequest);

    expect(response.status).toBe(200);
    expect(response.text()).resolves.toBe("Logged out");
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockSetCookie).toHaveBeenCalledWith("session", mockSession, { maxAge: 0 });
  });

  it("should return 404 if browser session is not found", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const mockRequest = new Request("http://localhost/api/logout", {
      method: "PATCH",
    });

    const response = await PATCH(mockRequest);

    expect(response.status).toBe(404);
    expect(response.text()).resolves.toBe("Browser session not found");
    expect(mockClient.query).not.toHaveBeenCalled();
  });

  it("should return 404 if database session is not found", async () => {
    const mockSession = "encrypted-session";
    const decryptedSession = {
      sessionId: "session-id-123",
      userAuthId: 123,
    };

    mockGetCookie.mockReturnValue({ value: mockSession });
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify(decryptedSession));

    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const mockRequest = new Request("http://localhost/api/logout", {
      method: "PATCH",
    });

    const response = await PATCH(mockRequest);

    expect(response.status).toBe(404);
    expect(response.text()).resolves.toBe("Database session not found");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });

  it("should return 500 for internal server error", async () => {
    const mockSession = "encrypted-session";
    const decryptedSession = {
      sessionId: "session-id-123",
      userAuthId: 123,
    };

    mockGetCookie.mockReturnValue({ value: mockSession });
    (decrypt as jest.Mock).mockReturnValue(JSON.stringify(decryptedSession));

    mockClient.query.mockRejectedValue(new Error("Database error"));

    const mockRequest = new Request("http://localhost/api/logout", {
      method: "PATCH",
    });

    const response = await PATCH(mockRequest);

    expect(response.status).toBe(500);
    expect(response.text()).resolves.toBe("Internal server error");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });
});
