import { GET } from "@/app/api/crud/post_comment/replies/[id]/route";
import pool from "../lib/db/pool";
import { CommentReply } from "@/lib/db/models";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/comment_reply/:id", () => {
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

    it("should return all replies for a specific post comment with status 200", async () => {
        const mockData = [
            {
                comment_reply_id: 1,
                post_comment_id: 101,
                user_id: 202,
                reply: "This is a reply",
                date_replied: "2023-12-01T12:34:56.000Z",
            },
            {
                comment_reply_id: 2,
                post_comment_id: 101,
                user_id: 203,
                reply: "This is another reply",
                date_replied: "2023-12-02T12:34:56.000Z",
            }
        ];

        client.query.mockResolvedValueOnce({ rows: mockData });

        const request = new Request("/api/comment_reply/101");
        const response = await GET(request, { params: { id: "101" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_reply WHERE post_comment_id = $1",
            ["101"]
        );
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual([
            {
                commentReplyId: 1,
                postCommentId: 101,
                userId: 202,
                reply: "This is a reply",
                dateReplied: "2023-12-01T12:34:56.000Z",
            },
            {
                commentReplyId: 2,
                postCommentId: 101,
                userId: 203,
                reply: "This is another reply",
                dateReplied: "2023-12-02T12:34:56.000Z",
            }
        ]);
    });

    it("should return an empty array if no replies are found", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request("/api/comment_reply/999");
        const response = await GET(request, { params: { id: "999" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_reply WHERE post_comment_id = $1",
            ["999"]
        );
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual([]);
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("/api/comment_reply/101");
        const response = await GET(request, { params: { id: "101" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM comment_reply WHERE post_comment_id = $1",
            ["101"]
        );
        expect(response.status).toBe(500);

        const text = await response.text();
        expect(text).toBe("Internal server error");
    });
});
