import { GET, POST, PUT, DELETE } from "@/app/api/crud/posts/route";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { Post } from "@/lib/db/models";

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("/api/posts API endpoints", () => {
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

    describe("GET /api/posts", () => {
        it("should return all posts with status 200", async () => {
            const mockData = [
                {
                    post_id: 1,
                    user_id: 101,
                    caption: "Test Post",
                    date_posted: "2023-12-01T12:34:56.000Z",
                },
            ];

            client.query.mockResolvedValueOnce({ rows: mockData });

            const request = new Request("http://localhost/api/posts");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM posts");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                {
                    postId: 1,
                    userId: 101,
                    caption: "Test Post",
                    datePosted: "2023-12-01T12:34:56.000Z",
                },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("http://localhost/api/posts");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM posts");
            expect(response.status).toBe(500);
        });
    });

    describe("POST /api/posts", () => {
        it("should create a new post and return 201", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);

            const mockPost = {
                caption: "New Post",
                datePosted: new Date().toISOString(),
            };

            client.query.mockResolvedValueOnce({ rows: [{ post_id: 1 }] });

            const request = new Request("http://localhost/api/posts", {
                method: "POST",
                body: JSON.stringify(mockPost),
            });

            const response = await POST(request);

            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO posts (user_id, caption, date_posted) VALUES ($1, $2, $3) RETURNING post_id",
                [101, mockPost.caption, mockPost.datePosted]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ postId: 1 });
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("http://localhost/api/posts", { method: "POST" });
            const response = await POST(request);

            expect(response.status).toBe(401);
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPost = {
                caption: "New Post",
                datePosted: new Date().toISOString(),
            };

            const request = new Request("http://localhost/api/posts", {
                method: "POST",
                body: JSON.stringify(mockPost),
            });

            const response = await POST(request);

            expect(response.status).toBe(500);
        });
    });

    describe("PUT /api/posts", () => {
        it("should update a post and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);

            const mockPost = {
                postId: 1,
                caption: "Updated Post",
                datePosted: new Date().toISOString(),
            };

            client.query.mockResolvedValueOnce({});

            const request = new Request("http://localhost/api/posts", {
                method: "PUT",
                body: JSON.stringify(mockPost),
            });

            const response = await PUT(request);

            expect(client.query).toHaveBeenCalledWith(
                "UPDATE posts SET user_id = $2, caption = $3, date_posted = $4 WHERE post_id = $1",
                [mockPost.postId, 101, mockPost.caption, mockPost.datePosted]
            );
            expect(response.status).toBe(200);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("http://localhost/api/posts", { method: "PUT" });
            const response = await PUT(request);

            expect(response.status).toBe(401);
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockPost = {
                postId: 1,
                caption: "Updated Post",
                datePosted: new Date().toISOString(),
            };

            const request = new Request("http://localhost/api/posts", {
                method: "PUT",
                body: JSON.stringify(mockPost),
            });

            const response = await PUT(request);

            expect(response.status).toBe(500);
        });
    });

    describe("DELETE /api/posts", () => {
        it("should delete a post and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);

            const request = new Request("http://localhost/api/posts", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            client.query.mockResolvedValueOnce({ rowCount: 1 });

            const response = await DELETE(request);

            expect(client.query).toHaveBeenCalledWith("DELETE FROM posts WHERE post_id = $1", [1]);
            expect(response.status).toBe(200);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("http://localhost/api/posts", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(response.status).toBe(401);
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("http://localhost/api/posts", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(response.status).toBe(500);
        });
    });
});
