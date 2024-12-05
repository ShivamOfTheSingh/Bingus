import { POST } from "@/app/api/crud/user_profile/route";
import pool from "@/lib/db/pool";
import { Request } from 'cross-fetch';

// Mock the database pool and client
jest.mock("../lib/db/pool");

describe("POST /api/crud/user_profile", () => {
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

    it("should return 201 and userId when a new user profile is created successfully", async () => {
        // Arrange
        const mockUserProfile = {
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Test about section",
            profilePicture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "POST",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock the database query responses
        mockClient.query
            .mockResolvedValueOnce({ rows: [] })  // First query (user does not exist)
            .mockResolvedValueOnce({ rows: [{ user_id: 1 }] });  // Second query (insertion)

        // Act
        const response = await POST(mockRequest);
        const responseBody = await response.json();

        // Assert
        expect(response.status).toBe(201);
        expect(responseBody).toEqual({ userId: 1 });
        expect(mockClient.query).toHaveBeenCalledTimes(2);
        expect(mockClient.query).toHaveBeenCalledWith(
            "SELECT * FROM user_profile WHERE user_name = $1 OR email = $2",
            [mockUserProfile.username, mockUserProfile.email]
        );
        expect(mockClient.query).toHaveBeenCalledWith(
            "INSERT INTO user_profile (user_name, email, first_name, last_name, gender, birth_date, about, profile_pic, pic_mime_type_prefix) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING user_id",
            [
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

    it("should return 409 when the user already exists", async () => {
        // Arrange
        const mockUserProfile = {
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Test about section",
            profilePicture: "",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "POST",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock the database query response indicating the user already exists
        mockClient.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });

        // Act
        const response = await POST(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(409);
        expect(responseBody).toBe("User already exists");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
        expect(mockClient.query).toHaveBeenCalledWith(
            "SELECT * FROM user_profile WHERE user_name = $1 OR email = $2",
            [mockUserProfile.username, mockUserProfile.email]
        );
    });

    it("should return 500 when there is a database error", async () => {
        // Arrange
        const mockUserProfile = {
            username: "testuser",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            gender: "Non-Binary",
            birthDate: "1990-01-01",
            about: "Test about section",
            profilePicture: "",
        };

        const mockRequest = new Request("http://localhost/api/user_profiles", {
            method: "POST",
            body: JSON.stringify(mockUserProfile),
            headers: { "Content-Type": "application/json" },
        });

        // Mock the database query to throw an error
        mockClient.query.mockRejectedValueOnce(new Error("Database error"));

        // Act
        const response = await POST(mockRequest);
        const responseBody = await response.text();

        // Assert
        expect(response.status).toBe(500);
        expect(responseBody).toBe("Failed to create data");
        expect(mockClient.query).toHaveBeenCalledTimes(1);
    });
});
