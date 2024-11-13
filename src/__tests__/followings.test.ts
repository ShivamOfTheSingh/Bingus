import { GET, POST, PUT, DELETE } from "@/app/api/crud/followings/route";
import { NextRequest } from "next/server";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

// Mock the database connection pool and getCurrentSessionUserId function
jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

describe("Followings API", () => {
  const mockQuery = jest.fn();
  const mockRelease = jest.fn();

  beforeEach(() => {
    // Mock the connection to return a mock client object with query and release methods
    (pool.connect as jest.Mock).mockResolvedValueOnce({
      query: mockQuery,
      release: mockRelease,
    });
    // Reset getCurrentSessionUserId mock before each test
    (getCurrentSessionUserId as jest.Mock).mockResolvedValue(1); // Default authenticated userId
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("GET", () => {
    it("should retrieve followings successfully", async () => {
      const mockData = [{ following_status_id: 1, user_id: 1, following_id: 2 }];
      mockQuery.mockResolvedValueOnce({ rows: mockData });

      const response = await GET(new NextRequest("http://localhost"));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([
        {
          followingId: 1,
          userId: 1,
          followedUserId: 2,
        },
      ]);
    });

    it("should handle errors when retrieving followings", async () => {
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const response = await GET(new NextRequest("http://localhost"));
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to fetch data");
    });

    it("should return an empty array if no followings exist", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await GET(new NextRequest("http://localhost"));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
    });
  });

  describe("POST", () => {
    it("should create a following successfully", async () => {
      const mockData = { followedUserId: 2 };
      mockQuery.mockResolvedValueOnce({
        rows: [{ following_status_id: 123 }],
      });

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(mockData),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ followingId: 123 });
    });

    it("should return 401 if the user is not authenticated", async () => {
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(-1); // Simulate unauthorized user

      const mockData = { followedUserId: 2 };
      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify(mockData),
      });

      const response = await POST(request);
      expect(response.status).toBe(401);
      expect(await response.text()).toBe("Unauthorized API call");
    });

    it("should handle errors when creating a following", async () => {
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({ followedUserId: 2 }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to create data");
    });
  });

  describe("PUT", () => {
    it("should update a following successfully", async () => {
      const mockData = { followingId: 1, userId: 1, followedUserId: 2 };
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify(mockData),
      });

      const response = await PUT(request);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });

    it("should return 401 if the user is not authenticated", async () => {
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(-1); // Simulate unauthorized user

      const mockData = { followingId: 1, userId: 1, followedUserId: 2 };
      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify(mockData),
      });

      const response = await PUT(request);
      expect(response.status).toBe(401);
      expect(await response.text()).toBe("Unauthorized API call");
    });

    it("should handle errors when updating a following", async () => {
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "PUT",
        body: JSON.stringify({ followingId: 1, userId: 1, followedUserId: 2 }),
      });

      const response = await PUT(request);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to update data");
    });
  });

  describe("DELETE", () => {
    it("should delete a following successfully", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      });

      const response = await DELETE(request);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });

    it("should return 401 if the user is not authenticated", async () => {
      (getCurrentSessionUserId as jest.Mock).mockResolvedValueOnce(-1); // Simulate unauthorized user

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      });

      const response = await DELETE(request);
      expect(response.status).toBe(401);
      expect(await response.text()).toBe("Unauthorized API call");
    });

    it("should handle errors when deleting a following", async () => {
      mockQuery.mockRejectedValueOnce(new Error("Database error"));

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      });

      const response = await DELETE(request);
      expect(response.status).toBe(500);
      expect(await response.text()).toBe("Failed to delete data");
    });

    it("should handle case when following does not exist (no rows affected)", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const request = new NextRequest("http://localhost", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      });

      const response = await DELETE(request);
      expect(response.status).toBe(200); // No error, just no data was deleted
      expect(await response.text()).toBe("OK");
    });
  });
});
