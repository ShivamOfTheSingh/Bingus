import { GET } from "@/app/api/crud/post_vote/[id]/route";
import pool from "../lib/db/pool";
import { PostVote } from "@/lib/db/models";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/post_vote/:id API endpoint", () => {
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

    describe("GET /api/post_vote/:id", () => {
        it("should return a single post vote with status 200", async () => {
            const mockData = {
                post_likes_id: 1,
                post_id: 101,
                user_id: 202,
            };

            client.query.mockResolvedValueOnce({ rows: [mockData] });

            const request = new Request("/api/post_vote/1");
            const response = await GET(request, { params: { id: "1" } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_vote WHERE post_likes_id = $1", [1]);
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

            const request = new Request("/api/post_vote/999");
            const response = await GET(request, { params: { id: "999" } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_vote WHERE post_likes_id = $1", [999]);
            expect(response.status).toBe(404);
            const text = await response.text();
            expect(text).toBe("Post vote record not found");
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/post_vote/1");
            const response = await GET(request, { params: { id: "1" } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_vote WHERE post_likes_id = $1", [1]);
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to retrieve data");
        });
    });
});