import { GET, POST, PUT, DELETE } from "@/app/api/crud/media/route";
import pool from "@/lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
import { NextRequest } from "next/server";

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;

describe("Media API endpoints", () => {
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

    describe("GET /api/media", () => {
        it("should return all media records", async () => {
            const mockMedia = [
                {
                    media_id: 1,
                    post_id: 101,
                    media_url: Buffer.from("test-media", "utf-8").toString("base64"),
                    mime_type_prefix: "data:image/png;base64,",
                },
            ];

            client.query.mockResolvedValueOnce({ rows: mockMedia });

            const request = new Request("/api/media");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM media");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                {
                    mediaId: 1,
                    postId: 101,
                    mediaUrl: "data:image/png;base64,dGVzdC1tZWRpYQ==",
                },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/media");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM media");
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to fetch data");
        });
    });

    describe("POST /api/media", () => {
        it("should create a new media record", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            const mockMedia = {
                postId: 101,
                mediaUrl: "data:image/png;base64,dGVzdC1tZWRpYQ==",
            };

            client.query.mockResolvedValueOnce({ rows: [{ media_id: 1 }] });

            const request = new Request("/api/media", {
                method: "POST",
                body: JSON.stringify(mockMedia),
            });

            const response = await POST(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO media (post_id, media_url, mime_type_prefix) VALUES ($1, $2, $3) RETURNING media_id",
                [101, Buffer.from("dGVzdC1tZWRpYQ==", "base64"), "data:image/png;base64,"]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ mediaId: 1 });
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(-1);

            const request = new Request("/api/media", { method: "POST" });
            const response = await POST(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            const mockMedia = {
                postId: 101,
                mediaUrl: "data:image/png;base64,dGVzdC1tZWRpYQ==",
            };

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/media", {
                method: "POST",
                body: JSON.stringify(mockMedia),
            });

            const response = await POST(request);

            expect(client.query).toHaveBeenCalled();
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to create data");
        });
    });

    describe("PUT /api/media", () => {
        it("should update a media record", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            const mockMedia = {
                mediaId: 1,
                postId: 101,
                mediaUrl: "data:image/png;base64,dGVzdC1tZWRpYQ==",
            };

            const request = new Request("/api/media", {
                method: "PUT",
                body: JSON.stringify(mockMedia),
            });

            const response = await PUT(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith(
                "UPDATE media SET post_id = $2, media_url = $3, mime_type_prefix = $4 WHERE media_id = $1",
                [1, 101, Buffer.from("dGVzdC1tZWRpYQ==", "base64"), "data:image/png;base64,"]
            );
            expect(response.status).toBe(200);
            const text = await response.text();
            expect(text).toBe("OK");
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(-1);

            const request = new Request("/api/media", { method: "PUT" });
            const response = await PUT(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            const mockMedia = {
                mediaId: 1,
                postId: 101,
                mediaUrl: "data:image/png;base64,dGVzdC1tZWRpYQ==",
            };

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/media", {
                method: "PUT",
                body: JSON.stringify(mockMedia),
            });

            const response = await PUT(request);

            expect(client.query).toHaveBeenCalled();
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to update data");
        });
    });

    describe("DELETE /api/media", () => {
        it("should delete a media record", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            client.query.mockResolvedValueOnce({ rowCount: 1 });

            const request = new Request("/api/media", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith("DELETE FROM media WHERE media_id = $1", [1]);
            expect(response.status).toBe(200);
        });

        it("should return 401 if user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(-1);

            const request = new Request("/api/media", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValueOnce(1);

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/media", {
                method: "DELETE",
                body: JSON.stringify({ id: 1 }),
            });

            const response = await DELETE(request);

            expect(client.query).toHaveBeenCalledWith("DELETE FROM media WHERE media_id = $1", [1]);
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to delete data");
        });
    });
});
