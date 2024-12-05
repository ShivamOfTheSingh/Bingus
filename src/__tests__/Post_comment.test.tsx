import { GET, POST, PUT, DELETE } from "@/app/api/crud/post_comment/route";
import pool from "../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { PostComment } from "@/lib/db/models";

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("/api/post_comment API endpoints", () => {
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

    describe("GET /api/post_comment", () => {
        it("should return all post comments with status 200", async () => {
            const mockData = [
                {
                    post_comment_id: 1,
                    post_id: 101,
                    user_id: 202,
                    post_comment: "This is a comment",
                    date_commented: "2023-12-01T12:34:56.000Z",
                },
            ];

            client.query.mockResolvedValueOnce({ rows: mockData });

            const request = new Request("/api/post_comment");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_comment");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                {
                    postCommentId: 1,
                    postId: 101,
                    userId: 202,
                    postComment: "This is a comment",
                    dateCommented: "2023-12-01T12:34:56.000Z", // Ensure consistency
                },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/post_comment");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_comment");
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to fetch data");
        });
    });

    describe("POST /api/post_comment", () => {
        it("should create a new post comment and return 201", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            const mockPostComment = {
                postId: 101,
                postComment: "This is a new comment",
                dateCommented: new Date().toISOString(),
            };

            client.query.mockResolvedValueOnce({ rows: [{ post_comment_id: 1 }] });

            const request = new Request("/api/post_comment", {
                method: "POST",
                body: JSON.stringify(mockPostComment),
            });

            const response = await POST(request);

            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO post_comment (post_id, user_id, post_comment, date_commented) VALUES ($1, $2, $3, $4) RETURNING post_comment_id",
                [mockPostComment.postId, 202, mockPostComment.postComment, mockPostComment.dateCommented]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ postCommentId: 1 });
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_comment", { method: "POST" });
            const response = await POST(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPostComment = {
                postId: 101,
                postComment: "This is a new comment",
                dateCommented: new Date(),
            };

            const request = new Request("/api/post_comment", {
                method: "POST",
                body: JSON.stringify(mockPostComment),
            });

            const response = await POST(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to create data");
        });
    });

    describe("PUT /api/post_comment", () => {
        it("should update a post comment and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);

            const mockPostComment = {
                postCommentId: 1,
                postId: 101,
                userId: 202,
                postComment: "Updated comment",
                dateCommented: new Date().toISOString(),
            };

            client.query.mockResolvedValueOnce({});

            const request = new Request("/api/post_comment", {
                method: "PUT",
                body: JSON.stringify(mockPostComment),
            });

            const response = await PUT(request);

            expect(client.query).toHaveBeenCalledWith(
                "UPDATE post_comment SET post_id = $2, user_id = $3, post_comment = $4, date_commented = $5 WHERE post_comment_id = $1",
                [mockPostComment.postCommentId, mockPostComment.postId, 202, mockPostComment.postComment, mockPostComment.dateCommented]
            );
            expect(response.status).toBe(200);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_comment", { method: "PUT" });
            const response = await PUT(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPostComment = {
                postCommentId: 1,
                postId: 101,
                userId: 202,
                postComment: "Updated comment",
                dateCommented: new Date(),
            };

            const request = new Request("/api/post_comment", {
                method: "PUT",
                body: JSON.stringify(mockPostComment),
            });

            const response = await PUT(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to update data");
        });
    });

    describe("DELETE /api/post_comment", () => {
        it("should delete a post comment and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202); // Ensure user is authorized
            client.query.mockResolvedValueOnce({ rowCount: 1 }); // Simulate successful deletion
    
            const request = new Request("/api/post_comment", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });
    
            const response = await DELETE(request);
    
            expect(client.query).toHaveBeenCalledWith(
                "DELETE FROM post_comment WHERE post_comment_id = $1",
                [1]
            );
            expect(response.status).toBe(200);
        });


        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/post_comment", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(202); // Ensure user is authorized
            client.query.mockRejectedValueOnce(new Error("Database error")); // Simulate DB error
    
            const request = new Request("/api/post_comment", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });
    
            const response = await DELETE(request);
    
            expect(client.query).toHaveBeenCalledWith(
                "DELETE FROM post_comment WHERE post_comment_id = $1",
                [1]
            );
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to delete data");
        });
    });
});
