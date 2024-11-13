import { DELETE } from "@/app/api/crud/user_profile/route";
import pool from "@/lib/db/pool";
import { Request } from 'cross-fetch';
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId"; // Adjust to actual path

// Mock the database pool and client
jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

describe("DELETE /api/crud/user_profile", () => {
    let mockClient: any;

    beforeEach(() => {
        // Set up a mock client with mocked query and release methods
        mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        // Ensure that pool.connect is treated as a Jest mock function
        (pool.connect as jest.Mock).mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 OK when the user profile is deleted successfully", async () => {
        // Arrange
        const mockUserId = 1;
        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "DELETE",
            body: JSON.stringify({ id: mockUserId }),
            headers: { "Content-Type": "application/json" },
        });

        // Mock the session userId and database query responses
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(mockUserId);
        mockClient.query.mockResolvedValue({});

        // Act
        const response = await DELETE(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(200);
        expect(responseBody).toBe("OK");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
        expect(mockClient.query).toHaveBeenCalledWith(
            "DELETE FROM user_profile WHERE user_id = $1",
            [mockUserId]
        );
    });

    it("should return 401 Unauthorized when the user is not authorized", async () => {
        // Arrange
        const mockUserId = 1;
        const differentUserId = 2; // Simulate an ID mismatch for unauthorized access
        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "DELETE",
            body: JSON.stringify({ id: mockUserId }),
            headers: { "Content-Type": "application/json" },
        });

        // Mock getCurrentSessionUserId to return a different ID, simulating an unauthorized request
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(differentUserId);

        // Act
        const response = await DELETE(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(401);
        expect(responseBody).toBe("Unauthorized API call");
        expect(mockClient.query).not.toHaveBeenCalled();
    });

    it("should return 500 when there is a database error", async () => {
        // Arrange
        const mockUserId = 1;
        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "DELETE",
            body: JSON.stringify({ id: mockUserId }),
            headers: { "Content-Type": "application/json" },
        });

        // Mock getCurrentSessionUserId and make the query throw an error
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(mockUserId);
        mockClient.query.mockRejectedValue(new Error("Database error"));

        // Act
        const response = await DELETE(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(500);
        expect(responseBody).toBe("Failed to delete data");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
    });
});
