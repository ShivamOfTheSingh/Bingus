import { GET } from "@/app/api/crud/followings/pair/route";
import pool from "@/lib/db/pool";
import { NextRequest } from "next/server";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/following", () => {
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

    it("should return the following object if it exists", async () => {
        const mockFollowing = {
            followings_status_id: 1,
            user_id: 101,
            following_id: 202,
        };

        client.query.mockResolvedValueOnce({ rows: [mockFollowing] });

        const request = new NextRequest("http://localhost/api/following?selfId=101&otherId=202");
        const response = await GET(request);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1 AND following_id = $2",
            ["101", "202"]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            followingId: 1,
            userId: 101,
            followedUserId: 202,
        });
    });

    it("should return 404 if the following object is not found", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new NextRequest("http://localhost/api/following?selfId=101&otherId=999");
        const response = await GET(request);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1 AND following_id = $2",
            ["101", "999"]
        );
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Following not found");
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new NextRequest("http://localhost/api/following?selfId=101&otherId=202");
        const response = await GET(request);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM followings WHERE user_id = $1 AND following_id = $2",
            ["101", "202"]
        );
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal server error");
    });
});
