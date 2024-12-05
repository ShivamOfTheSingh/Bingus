import { GET, POST, PUT, DELETE } from "@/app/api/crud/comment_reply/route";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";


jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("comment_reply API endpoints", () => {
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
        it("should return all comment replies", async () => {
            client.query.mockResolvedValueOnce({
                rows: [{ comment_reply_id: 1, post_comment_id: 1, user_id: 1, reply: "Test", date_replied: new Date().toISOString() }],
            });

            const response = await GET(new Request("/api/comment_reply"));

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_reply");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                {
                    commentReplyId: 1,
                    postCommentId: 1,
                    userId: 1,
                    reply: "Test",
                    dateReplied: expect.any(String), // Match serialized ISO date
                },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const response = await GET(new Request("/api/comment_reply"));

            expect(response.status).toBe(500);
        });
    });

    describe("POST", () => {
        it("should create a new comment reply", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);
            client.query.mockResolvedValueOnce({ rows: [{ comment_reply_id: 1 }] });

            const body = JSON.stringify({ postCommentId: 1, reply: "Test reply", dateReplied: new Date().toISOString() });
            const response = await POST(new Request("/api/comment_reply", { method: "POST", body }));

            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO comment_reply (post_comment_id, user_id, reply, date_replied) VALUES ($1, $2, $3, $4) RETURNING comment_reply_id",
                [1, 1, "Test reply", expect.any(String)]
            );
            expect(response.status).toBe(201);
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const response = await POST(new Request("/api/comment_reply", { method: "POST", body: "{}" }));

            expect(response.status).toBe(401);
        });
    });

    describe("PUT", () => {
        it("should update a comment reply", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            const body = JSON.stringify({ commentReplyId: 1, postCommentId: 1, reply: "Updated reply", dateReplied: new Date().toISOString() });
            const response = await PUT(new Request("/api/comment_reply", { method: "PUT", body }));

            expect(client.query).toHaveBeenCalledWith(
                "UPDATE comment_reply SET post_comment_id = $2, user_id = $3, reply = $4, date_replied = $5 WHERE comment_reply_id = $1",
                [1, 1, 1, "Updated reply", expect.any(String)]
            );
            expect(response.status).toBe(200);
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const response = await PUT(new Request("/api/comment_reply", { method: "PUT", body: "{}" }));

            expect(response.status).toBe(401);
        });
    });

    describe("DELETE", () => {
        it("should delete a comment reply", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            const body = JSON.stringify({ id: 1 });
            const response = await DELETE(new Request("/api/comment_reply", { method: "DELETE", body }));

            expect(client.query).toHaveBeenCalledWith("DELETE FROM comment_reply WHERE comment_reply_id=$1", [1]);
            expect(response.status).toBe(200);
        });

        it("should return 500 if an error occurs during deletion", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);
            client.query.mockRejectedValueOnce(new Error("Deletion error"));

            const body = JSON.stringify({ id: 1 });
            const response = await DELETE(new Request("/api/comment_reply", { method: "DELETE", body }));

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data).toBe("Failed to delete data");
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const response = await DELETE(new Request("/api/comment_reply", { method: "DELETE", body: "{}" }));

            expect(response.status).toBe(401);
        });
    });
});
