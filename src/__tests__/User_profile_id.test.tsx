import { GET } from "@/app/api/crud/user_profile/[id]/route";
import pool from "@/lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/user_profile/:id API endpoint", () => {
    let client: any;

    beforeEach(() => {
        client = {
            query: jest.fn(),
            release: jest.fn(),
        };
        mockPool.connect.mockResolvedValue(client);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the user profile for a valid ID with status 200", async () => {
        const mockData = [
            {
                user_id: 101,
                user_name: "johndoe",
                email: "johndoe@example.com",
                first_name: "John",
                last_name: "Doe",
                gender: "Male",
                birth_date: "1990-01-01",
                about: "Software developer",
                profile_pic: "VGhpcyBpcyBhIHRlc3Q=", // "This is a test" in base64
                pic_mime_type_prefix: "data:image/jpeg;base64,",
            },
        ];

        client.query.mockResolvedValueOnce({ rows: mockData });

        const request = new Request("http://localhost/api/user_profile/101");
        const params = { params: { id: "101" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM user_profile WHERE user_id = $1", [101]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            userId: 101,
            username: "johndoe",
            email: "johndoe@example.com",
            firstName: "John",
            lastName: "Doe",
            gender: "Male",
            birthDate: new Date(mockData[0].birth_date).toISOString(),
            about: "Software developer",
            profilePicture: "data:image/jpeg;base64,VGhpcyBpcyBhIHRlc3Q=",
        });
    });

    it("should return 404 if the user profile is not found", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request("http://localhost/api/user_profile/999");
        const params = { params: { id: "999" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM user_profile WHERE user_id = $1", [999]);
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("User profile record not found");
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("http://localhost/api/user_profile/101");
        const params = { params: { id: "101" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM user_profile WHERE user_id = $1", [101]);
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});
