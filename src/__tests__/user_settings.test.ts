import { GET, POST, PUT, DELETE } from "@/app/api/crud/user_settings/route";
import { NextRequest } from "next/server";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

// Mock the database pool and session handling
jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

describe("User Settings API", () => {
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    // Mock the connection to return a mock client object with query and release methods
    (pool.connect as jest.Mock).mockResolvedValueOnce({
      query: mockQuery,
      release: mockRelease,
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test cases for GET endpoint
  describe("GET /user_settings", () => {
    it("should return a list of user settings", async () => {
      const mockData = [
        { user_settings_id: 1, user_id: "user1", show_name: "John", profile_public: true },
        { user_settings_id: 2, user_id: "user2", show_name: "Jane", profile_public: false },
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockData });

      const request = new NextRequest("http://localhost", { method: "GET" });
      const response = await GET(request);

      expect(response.status).toBe(200);
      const responseData = await response.json();
      // Correct the expected object structure to match the response
      const expectedData = [
        { userSettingsId: 1, userId: "user1", showName: "John", profilePublic: true },
        { userSettingsId: 2, userId: "user2", showName: "Jane", profilePublic: false },
      ];
      expect(responseData).toEqual(expectedData);
      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM user_settings");
    });

    it("should handle errors gracefully", async () => {
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", { method: "GET" });
      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to fetch data");
    });
  });

  // Test cases for POST endpoint
  describe("POST /user_settings", () => {
    it("should successfully create new user settings", async () => {
      const mockData = { userId: "user123", showName: "John", profilePublic: true };
      mockQuery.mockResolvedValueOnce({ rows: [] }); // Simulate no existing user settings
      mockQuery.mockResolvedValueOnce({ rows: [{ user_settings_id: 1 }] }); // Simulate insert result

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(mockData),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      const responseData = await response.json();
      expect(responseData.userSettingsId).toBe(1);
      expect(mockQuery).toHaveBeenCalledTimes(2);
    });

    it("should return 409 if user settings already exist", async () => {
      const mockData = { userId: "user123", showName: "John", profilePublic: true };
      mockQuery.mockResolvedValueOnce({ rows: [{ user_settings_id: 1 }] }); // Simulate existing user settings

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(mockData),
      });

      const response = await POST(request);

      expect(response.status).toBe(409);
      expect(await response.text()).toBe("User settings object already exists");
    });

    it("should handle errors gracefully", async () => {
      const mockData = { userId: "user123", showName: "John", profilePublic: true };
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(mockData),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to create data");
    });
  });

  // Test cases for PUT endpoint
  describe("PUT /user_settings", () => {
    it("should successfully update user settings", async () => {
      const mockData = { userSettingsId: 1, userId: "user123", showName: "Updated", profilePublic: false };
      mockQuery.mockResolvedValueOnce({ rows: [] }); // Simulate existing user settings

      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify(mockData),
      });

      const response = await PUT(request);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should return 401 for unauthorized access", async () => {
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(-1); // Simulate unauthorized user

      const mockData = { userSettingsId: 1, userId: "user123", showName: "Updated", profilePublic: false };

      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify(mockData),
      });

      const response = await PUT(request);

      expect(response.status).toBe(401);
      expect(await response.text()).toBe("Unauthorized API call");
    });

    it("should handle errors gracefully", async () => {
      const mockData = { userSettingsId: 1, userId: "user123", showName: "Updated", profilePublic: false };
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify(mockData),
      });

      const response = await PUT(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to update data");
    });
  });

  // Test cases for DELETE endpoint
  describe("DELETE /user_settings", () => {
    it("should successfully delete user settings", async () => {
      const mockData = { id: 1 };
      mockQuery.mockResolvedValueOnce({ rows: [] }); // Simulate successful deletion

      // Mock the session user ID to match the ID in the request
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(1);

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify(mockData),
      });

      const response = await DELETE(request);

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it("should return 401 for unauthorized access", async () => {
      const mockData = { id: 1 };

      // Simulate unauthorized access by returning a different userId
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(2); // Simulate unauthorized user

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify(mockData),
      });

      const response = await DELETE(request);

      expect(response.status).toBe(401);
      expect(await response.text()).toBe("Unauthorized API call");
    });

    it("should handle database errors gracefully", async () => {
      const mockData = { id: 1 };
      
      // Simulate a database error after authorization
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(1); // Simulate authorized user
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify(mockData),
      });

      const response = await DELETE(request);

      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to delete data");
    });
});
});
