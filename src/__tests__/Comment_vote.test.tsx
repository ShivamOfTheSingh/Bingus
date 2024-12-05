import { GET, POST, PUT, DELETE } from "@/app/api/crud/comment_vote/route";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";


jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("comment_vote API endpoints", () => {
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

    describe("GET", () => {
        it("should return all comment votes", async () => {
            client.query.mockResolvedValueOnce({
                rows: [
                    { comment_vote_id: 1, post_comment_id: 101, user_id: 1001 },
                ],
            });

            const response = await GET(new Request("/api/comment_vote"));
            expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_vote");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                {
                    commentVoteId: 1,
                    postCommentId: 101,
                    userId: 1001,
                },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const response = await GET(new Request("/api/comment_vote"));
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to fetch data");
        });
    });

    describe("POST", () => {
        it("should create a new comment vote", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1001);
            client.query.mockResolvedValueOnce({ rows: [{ comment_vote_id: 1 }] });

            const body = JSON.stringify({ postCommentId: 101 });
            const response = await POST(new Request("/api/comment_vote", { method: "POST", body }));

            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO comment_vote (post_comment_id, user_id) VALUES ($1, $2) RETURNING comment_vote_id",
                [101, 1001]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ commentVoteId: 1 });
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const body = JSON.stringify({ postCommentId: 101 });
            const response = await POST(new Request("/api/comment_vote", { method: "POST", body }));

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });
    });

    describe("PUT", () => {
        it("should update a comment vote", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1001);

            const body = JSON.stringify({
                commentVoteId: 1,
                postCommentId: 102,
            });
            const response = await PUT(new Request("/api/comment_vote", { method: "PUT", body }));

            expect(client.query).toHaveBeenCalledWith(
                "UPDATE comment_vote SET post_comment_id = $2, user_id = $3 WHERE comment_vote_id = $1",
                [1, 102, 1001]
            );
            expect(response.status).toBe(200);
            const text = await response.text();
            expect(text).toBe("OK");
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const body = JSON.stringify({ commentVoteId: 1, postCommentId: 102 });
            const response = await PUT(new Request("/api/comment_vote", { method: "PUT", body }));

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });
    });

    describe("DELETE", () => {
        it("should delete a comment vote", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1001);

            const body = JSON.stringify({ id: 1 });
            const response = await DELETE(new Request("/api/comment_vote", { method: "DELETE", body }));

            expect(client.query).toHaveBeenCalledWith("DELETE FROM comment_vote WHERE comment_vote_id = $1", [1]);
            expect(response.status).toBe(200);
            const text = await response.text();
            expect(text).toBe("OK");
        });

        it("should return 500 if an error occurs during deletion", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1001);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const body = JSON.stringify({ id: 1 });
            const response = await DELETE(new Request("/api/comment_vote", { method: "DELETE", body }));

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to delete data");
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const body = JSON.stringify({ id: 1 });
            const response = await DELETE(new Request("/api/comment_vote", { method: "DELETE", body }));

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });
    });
});