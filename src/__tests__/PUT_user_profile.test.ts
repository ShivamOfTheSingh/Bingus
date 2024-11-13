import { PUT } from "@/app/api/crud/user_profile/route";
import pool from "@/lib/db/pool";
import { Request } from 'cross-fetch';
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId"; // Adjust to actual path

// Mock the database pool and client
jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

describe("PUT /api/crud/user_profile", () => {
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

    it("should return 200 OK when the user profile is updated successfully", async () => {
        // Arrange
        const mockUserProfile = {
            userId: 1,
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Updated about section",
            profilePicture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "PUT",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock the session userId and database query responses
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(mockUserProfile.userId);
        mockClient.query.mockResolvedValue({});

        // Act
        const response = await PUT(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(200);
        expect(responseBody).toBe("OK");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
        expect(mockClient.query).toHaveBeenCalledWith(
            "UPDATE user_profile SET user_name = $2, email = $3, first_name = $4, last_name = $5, gender = $6, birth_date = $7, about = $8, profile_pic = $9, pic_mime_type_prefix = $10 WHERE user_id = $1",
            [
                mockUserProfile.userId,
                mockUserProfile.username,
                mockUserProfile.email,
                mockUserProfile.firstName,
                mockUserProfile.lastName,
                mockUserProfile.gender,
                mockUserProfile.birthDate,
                mockUserProfile.about,
                expect.any(Buffer),
                "data:image/png;base64,",
            ]
        );
    });

    it("should return 401 Unauthorized when the user is not authorized", async () => {
        // Arrange
        const mockUserProfile = {
            userId: 1,
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Updated about section",
            profilePicture: "",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "PUT",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock getCurrentSessionUserId to simulate an unauthorized request
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(-1);

        // Act
        const response = await PUT(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(401);
        expect(responseBody).toBe("Unauthorized API call");
        expect(mockClient.query).not.toHaveBeenCalled();
    });

    it("should return 500 when there is a database error", async () => {
        // Arrange
        const mockUserProfile = {
            userId: 1,
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Updated about section",
            profilePicture: "",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "PUT",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock getCurrentSessionUserId and make the query throw an error
        (getCurrentSessionUserId as jest.Mock).mockResolvedValue(mockUserProfile.userId);
        mockClient.query.mockRejectedValue(new Error("Database error"));

        // Act
        const response = await PUT(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(500);
        expect(responseBody).toBe("Failed to update data");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
    });
});
