import { GET, POST, PUT, DELETE } from "@/app/api/crud/post_vote/route";
import pool from "../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { PostVote } from "@/lib/db/models";

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("/api/post_vote API endpoints", () => {
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

    describe("GET /api/post_vote", () => {
        it("should return all post votes with status 200", async () => {
            const mockData = [
                { post_likes_id: 1, post_id: 101, user_id: 202 },
                { post_likes_id: 2, post_id: 102, user_id: 203 },
            ];

            client.query.mockResolvedValueOnce({ rows: mockData });

            const request = new Request("/api/post_vote");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_vote");
            expect(response.status).toBe(200);

            const data = await response.json();
            expect(data).toEqual([
                { postVoteId: 1, postId: 101, userId: 202 },
                { postVoteId: 2, postId: 102, userId: 203 },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/post_vote");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_vote");
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to fetch data");
        });
    });

    describe("POST /api/post_vote", () => {
        it("should create a new post vote and return 201", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            const mockPostVote = { postId: 101 };

            client.query.mockResolvedValueOnce({ rows: [{ post_likes_id: 1 }] });

            const request = new Request("/api/post_vote", {
                method: "POST",
                body: JSON.stringify(mockPostVote),
            });

            const response = await POST(request);

            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO post_vote (post_id, user_id) VALUES ($1, $2) RETURNING post_likes_id",
                [mockPostVote.postId, 202]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ postVoteId: 1 });
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_vote", { method: "POST" });
            const response = await POST(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPostVote = { postId: 101 };

            const request = new Request("/api/post_vote", {
                method: "POST",
                body: JSON.stringify(mockPostVote),
            });

            const response = await POST(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to create data");
        });
    });

    describe("PUT /api/post_vote", () => {
        it("should update a post vote and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);

            const mockPostVote = {
                postVoteId: 1,
                postId: 101,
                userId: 202,
            };

            client.query.mockResolvedValueOnce({});

            const request = new Request("/api/post_vote", {
                method: "PUT",
                body: JSON.stringify(mockPostVote),
            });

            const response = await PUT(request);

            expect(client.query).toHaveBeenCalledWith(
                "UPDATE post_vote SET post_id = $2, user_id = $3 WHERE post_likes_id = $1",
                [mockPostVote.postVoteId, mockPostVote.postId, mockPostVote.userId]
            );
            expect(response.status).toBe(200);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_vote", { method: "PUT" });
            const response = await PUT(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPostVote = {
                postVoteId: 1,
                postId: 101,
                userId: 202,
            };

            const request = new Request("/api/post_vote", {
                method: "PUT",
                body: JSON.stringify(mockPostVote),
            });

            const response = await PUT(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to update data");
        });
    });

    describe("DELETE /api/post_vote", () => {
        it("should delete a post vote and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockResolvedValueOnce({});

            const request = new Request("/api/post_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(client.query).toHaveBeenCalledWith("DELETE FROM post_vote WHERE post_likes_id = $1", [1]);
            expect(response.status).toBe(200);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/post_vote", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to delete data");
        });
    });
});
