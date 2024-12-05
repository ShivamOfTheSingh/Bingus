import { GET } from "@/app/api/crud/followings/followingUserId/[id]/route";
import pool from "../lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/followings/:id", () => {
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

    it("should return followings with status 200 when user_id matches", async () => {
        const mockId = "101";
        const mockResponse = [
            {
                followings_status_id: 1,
                user_id: 101,
                following_id: 201,
            },
            {
                followings_status_id: 2,
                user_id: 101,
                following_id: 202,
            },
        ];

        client.query.mockResolvedValueOnce({ rows: mockResponse });

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1",
            [mockId]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual([
            {
                followingId: mockResponse[0].followings_status_id,
                userId: mockResponse[0].user_id,
                followedUserId: mockResponse[0].following_id,
            },
            {
                followingId: mockResponse[1].followings_status_id,
                userId: mockResponse[1].user_id,
                followedUserId: mockResponse[1].following_id,
            },
        ]);
    });

    it("should return an empty array with status 200 if no followings match the user_id", async () => {
        const mockId = "999";

        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1",
            [mockId]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual([]);
    });

    it("should return status 500 on database error", async () => {
        const mockId = "101";

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1",
            [mockId]
        );
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal Server Error");
    });
});
