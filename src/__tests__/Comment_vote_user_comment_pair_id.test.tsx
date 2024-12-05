import { GET } from "@/app/api/crud/comment_vote/[id]/route";
import pool from "../lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/comment_vote/[id]", () => {
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

    it("should return a single comment vote by ID", async () => {
        const mockId = 1;
        const mockResponse = {
            comment_vote_id: 1,
            post_comment_id: 101,
            user_id: 1001,
        };

        client.query.mockResolvedValueOnce({ rows: [mockResponse] });

        const response = await GET(new Request(`/api/comment_vote/${mockId}`), { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_vote WHERE comment_vote_id = $1", [mockId]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            commentVoteId: mockResponse.comment_vote_id,
            postCommentId: mockResponse.post_comment_id,
            userId: mockResponse.user_id,
        });
    });

    it("should return 404 when the comment vote ID is not found", async () => {
        const mockId = 9999;

        client.query.mockResolvedValueOnce({ rows: [] });

        const response = await GET(new Request(`/api/comment_vote/${mockId}`), { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_vote WHERE comment_vote_id = $1", [mockId]);
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Comment vote not found");
    });

    it("should return 500 on database error", async () => {
        const mockId = 1;

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const response = await GET(new Request(`/api/comment_vote/${mockId}`), { params: { id: `${mockId}` } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_vote WHERE comment_vote_id = $1", [mockId]);
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});