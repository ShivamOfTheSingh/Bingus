import { GET } from "@/app/api/crud/posts/comments/[id]/route";
import pool from "@/lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/post_comment/:id API endpoint", () => {
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

    it("should return all comments for a post with status 200", async () => {
        const mockData = [
            {
                post_comment_id: 1,
                post_id: 101,
                user_id: 202,
                post_comment: "This is a comment",
                date_commented: "2023-12-01T12:34:56.000Z",
            },
            {
                post_comment_id: 2,
                post_id: 101,
                user_id: 203,
                post_comment: "Another comment",
                date_commented: "2023-12-01T12:45:00.000Z",
            },
        ];

        client.query.mockResolvedValueOnce({ rows: mockData });

        const request = new Request("http://localhost/api/post_comment/101");
        const params = { params: { id: "101" } }; // Pass ID as a string to mimic real usage

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_comment WHERE post_id = $1", ["101"]); // Expect string
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual([
            {
                postCommentId: 1,
                postId: 101,
                userId: 202,
                postComment: "This is a comment",
                dateCommented: new Date(mockData[0].date_commented).toISOString(),
            },
            {
                postCommentId: 2,
                postId: 101,
                userId: 203,
                postComment: "Another comment",
                dateCommented: new Date(mockData[1].date_commented).toISOString(),
            },
        ]);
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("http://localhost/api/post_comment/101");
        const params = { params: { id: "101" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_comment WHERE post_id = $1", ["101"]); // Expect string
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal server error");
    });

    it("should return an empty array if there are no comments for the post", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request("http://localhost/api/post_comment/999");
        const params = { params: { id: "999" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM post_comment WHERE post_id = $1", ["999"]); // Expect string
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual([]);
    });
});
