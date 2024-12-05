import { GET } from "@/app/api/crud/post_vote/user_post_pair/route";
import pool from "../lib/db/pool";
import { PostVote } from "@/lib/db/models";
import { NextRequest } from "next/server";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/post_vote API endpoint with query params", () => {
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

    describe("GET /api/post_vote?userId=:userId&postId=:postId", () => {
        it("should return a post vote with status 200", async () => {
            const mockData = {
                post_likes_id: 1,
                post_id: 101,
                user_id: 202,
            };

            client.query.mockResolvedValueOnce({ rows: [mockData] });

            const request = new NextRequest("http://localhost/api/post_vote?userId=202&postId=101");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith(
                "SELECT * FROM post_vote WHERE user_id = $1 AND post_id = $2",
                ["202", "101"]
            );
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({
                postVoteId: 1,
                postId: 101,
                userId: 202,
            });
        });

        it("should return 404 if the post vote is not found", async () => {
            client.query.mockResolvedValueOnce({ rows: [] });

            const request = new NextRequest("http://localhost/api/post_vote?userId=999&postId=888");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith(
                "SELECT * FROM post_vote WHERE user_id = $1 AND post_id = $2",
                ["999", "888"]
            );
            expect(response.status).toBe(404);
            const text = await response.text();
            expect(text).toBe("Not found");
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new NextRequest("http://localhost/api/post_vote?userId=202&postId=101");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith(
                "SELECT * FROM post_vote WHERE user_id = $1 AND post_id = $2",
                ["202", "101"]
            );
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Internal Server Error");
        });
    });
});
