import { GET } from "@/app/api/crud/user_profile/route";
import pool from "@/lib/db/pool";

jest.mock("../lib/db/pool");

describe("GET /api/crud/user_profile", () => {
    let mockClient: any;

    beforeEach(() => {
        mockClient = {
            query: jest.fn(),
            release: jest.fn(),
        };

        (pool.connect as jest.Mock).mockResolvedValue(mockClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 and user profiles when the query is successful", async () => {
        // Mock the query result
        const mockRows = [
            {
                user_id: 1,
                user_name: "john_doe",
                email: "john.doe@example.com",
                first_name: "John",
                last_name: "Doe",
                gender: "male",
                birth_date: "1990-01-01",
                about: "About John",
                profile_pic: "some_base64_encoded_data",
                pic_mime_type_prefix: "data:image/png;base64,",
            },
        ];

        mockClient.query.mockResolvedValue({ rows: mockRows });

        // Call the GET function
        const response = await GET(new Request("http://localhost/api/user_profiles"));

        // Check the response
        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData).toEqual([
            {
                userId: 1,
                username: "john_doe",
                email: "john.doe@example.com",
                firstName: "John",
                lastName: "Doe",
                gender: "male",
                birthDate: new Date("1990-01-01").toISOString(),
                about: "About John",
                profilePicture: "data:image/png;base64,some_base64_encoded_data",
            },
        ]);
    });

    it("should return 500 when there is a database error", async () => {
        // Mock a query error
        mockClient.query.mockRejectedValue(new Error("Database error"));

        // Call the GET function
        const response = await GET(new Request("http://localhost/api/user_profiles"));

        // Check the response status
        expect(response.status).toBe(500);
        const responseText = await response.text();
        expect(responseText).toBe("Internal server error");
    });
});