// __tests__/user_registration.test.ts
import { POST } from "@/app/api/session/register/route";
import { NextRequest } from "next/server";
import pool from "@/lib/db/pool";
import bcrypt from "bcrypt";

// Mock bcrypt and pool
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));
jest.mock("../lib/db/pool");

describe("User Registration API", () => {
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    // Mock the connection to return a mock client object with query and release methods
    (pool.connect as jest.Mock).mockResolvedValueOnce({
      query: mockQuery,
      release: mockRelease,
    });
    // Mock bcrypt.hash to return a dummy encrypted password
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("encryptedPassword");
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should successfully register a user", async () => {
    const mockData = { userId: "user123", password: "password123", dateRegistered: "2024-01-01" };
    const mockResult = { rows: [] }; // Simulate no existing user in DB

    // Simulate the result of the user check query (no existing user)
    mockQuery.mockResolvedValueOnce(mockResult); 

    // Simulate successful user insert query
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockData),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(await response.text()).toBe("User successfully registered");

    // Ensure bcrypt.hash was called correctly
    expect(bcrypt.hash).toHaveBeenCalledWith(mockData.password, 10);

    // Ensure the first query checks if the user exists
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT * FROM user_auth WHERE user_id = $1",
      [mockData.userId]
    );

    // Ensure the second query inserts the user with correct params
    expect(mockQuery).toHaveBeenCalledWith(
      expect.any(String), // Query is a string
      expect.arrayContaining([
        "encryptedPassword",  // The password should be the encrypted value
        mockData.dateRegistered,  // The date should match
        mockData.userId,  // The userId should match
      ])
    );
  });

  it("should handle errors gracefully", async () => {
    const mockData = { userId: "user123", password: "password123", dateRegistered: "2024-01-01" };

    // Mocking a database error during the first query
    mockQuery.mockRejectedValueOnce(new Error("Database error"));

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockData),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Internal Server Error");
  });

  it("should return conflict if user already exists", async () => {
    const mockData = { userId: "user123", password: "password123", dateRegistered: "2024-01-01" };

    // Simulate an existing user in the DB
    const mockExistingUser = { rows: [{ user_id: "user123" }] };

    mockQuery.mockResolvedValueOnce(mockExistingUser); // Simulate the user check query finding an existing user

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify(mockData),
    });

    const response = await POST(request);

    expect(response.status).toBe(409);  // Expecting conflict status code
    expect(await response.text()).toBe("User already exists");
  });
});
