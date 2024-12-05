import { GET } from "@/app/api/crud/post_comment/[id]/route";
import pool from "../lib/db/pool";
import { PostComment } from "@/lib/db/models";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/post_comment/:id", () => {
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

    it("should return a single post comment with status 200", async () => {
        const mockData = {
            post_comment_id: 1,
            post_id: 101,
            user_id: 202,
            post_comment: "This is a comment",
            date_commented: "2023-12-01T12:34:56.000Z",
        };

        client.query.mockResolvedValueOnce({ rows: [mockData] });

        const request = new Request("/api/post_comment/1");
        const response = await GET(request, { params: { id: "1" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM post_comment WHERE post_comment_id = $1",
            [1]
        );
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual({
            postCommentId: 1,
            postId: 101,
            userId: 202,
            postComment: "This is a comment",
            dateCommented: "2023-12-01T12:34:56.000Z",
        });
    });

    it("should return 404 if the post comment is not found", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request("/api/post_comment/999");
        const response = await GET(request, { params: { id: "999" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM post_comment WHERE post_comment_id = $1",
            [999]
        );
        expect(response.status).toBe(404);

        const text = await response.text();
        expect(text).toBe("Post comment record not found");
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("/api/post_comment/1");
        const response = await GET(request, { params: { id: "1" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT * FROM post_comment WHERE post_comment_id = $1",
            [1]
        );
        expect(response.status).toBe(500);

        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});
