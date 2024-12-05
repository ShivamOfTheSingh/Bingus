import { GET } from "@/app/api/crud/comment_vote/user_comment_pair/route";
import pool from "@/lib/db/pool";
import { NextRequest } from "next/server";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/comment_vote", () => {
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

    it("should return a comment vote when userId and postCommentId match", async () => {
        const mockRequest = {
            nextUrl: {
                searchParams: {
                    get: jest.fn((key: string) => {
                        if (key === "userId") return "1";
                        if (key === "postCommentId") return "101";
                        return null;
                    }),
                },
            },
        } as unknown as NextRequest;

        const mockResponse = {
            comment_vote_id: 1,
            post_comment_id: 101,
            user_id: 1,
        };

        client.query.mockResolvedValueOnce({ rows: [mockResponse] });

        const response = await GET(mockRequest);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_vote WHERE user_id = $1 AND post_comment_id = $2",
            ["1", "101"]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            commentVoteId: mockResponse.comment_vote_id,
            postCommentId: mockResponse.post_comment_id,
            userId: mockResponse.user_id,
        });
    });

    it("should return 404 when no matching comment vote is found", async () => {
        const mockRequest = {
            nextUrl: {
                searchParams: {
                    get: jest.fn((key: string) => {
                        if (key === "userId") return "1";
                        if (key === "postCommentId") return "102";
                        return null;
                    }),
                },
            },
        } as unknown as NextRequest;

        client.query.mockResolvedValueOnce({ rows: [] });

        const response = await GET(mockRequest);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_vote WHERE user_id = $1 AND post_comment_id = $2",
            ["1", "102"]
        );
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Not found");
    });

    it("should return 500 on database error", async () => {
        const mockRequest = {
            nextUrl: {
                searchParams: {
                    get: jest.fn((key: string) => {
                        if (key === "userId") return "1";
                        if (key === "postCommentId") return "103";
                        return null;
                    }),
                },
            },
        } as unknown as NextRequest;

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const response = await GET(mockRequest);

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_vote WHERE user_id = $1 AND post_comment_id = $2",
            ["1", "103"]
        );
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal Server Error");
    });
});
