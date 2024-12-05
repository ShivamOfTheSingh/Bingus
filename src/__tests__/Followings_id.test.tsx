import { GET } from "@/app/api/crud/followings/[id]/route";
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

    it("should return a single following record with status 200", async () => {
        const mockId = 1;
        const mockResponse = {
            following_status_id: mockId,
            user_id: 101,
            following_id: 202,
        };

        client.query.mockResolvedValueOnce({ rows: [mockResponse] });

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE following_status_id = $1",
            [mockId]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            followingId: mockResponse.following_status_id,
            userId: mockResponse.user_id,
            followedUserId: mockResponse.following_id,
        });
    });

    it("should return 404 when the following record is not found", async () => {
        const mockId = 999;

        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE following_status_id = $1",
            [mockId]
        );
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Following record not found");
    });

    it("should return 500 on database error", async () => {
        const mockId = 1;

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request(`/api/followings/${mockId}`);
        const response = await GET(request, { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE following_status_id = $1",
            [mockId]
        );
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});
