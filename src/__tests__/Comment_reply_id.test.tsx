import { GET } from "@/app/api/crud/comment_reply/[id]/route";
import pool from "@/lib/db/pool"; // Correct import for the database pool

jest.mock("../lib/db/pool"); // Mock the correct path for the database pool

const mockPool = pool as jest.Mocked<typeof pool>;

describe("comment_reply/[id] API", () => {
    let client: any;

    beforeEach(() => {
        client = {
            query: jest.fn(),
            release: jest.fn(),
        };
        mockPool.connect.mockResolvedValue(client); // Properly mock the connection
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET", () => {
        it("should return a single comment reply by ID", async () => {
            const mockId = 1;
            const mockResponse = {
                comment_reply_id: 1,
                post_comment_id: 10,
                user_id: 100,
                reply: "Test reply",
                date_replied: new Date().toISOString(),
            };

            client.query.mockResolvedValueOnce({ rows: [mockResponse] });

            const response = await GET(new Request(`/api/comment_reply/${mockId}`), { params: { id: `${mockId}` } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_reply WHERE comment_reply_id = $1", [mockId]);
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({
                commentReplyId: mockResponse.comment_reply_id,
                postCommentId: mockResponse.post_comment_id,
                userId: mockResponse.user_id,
                reply: mockResponse.reply,
                dateReplied: expect.any(String), // Check ISO string format
            });
        });

        it("should return 404 when the comment reply ID is not found", async () => {
            const mockId = 9999;

            client.query.mockResolvedValueOnce({ rows: [] });

            const response = await GET(new Request(`/api/comment_reply/${mockId}`), { params: { id: `${mockId}` } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_reply WHERE comment_reply_id = $1", [mockId]);
            expect(response.status).toBe(404);
            const data = await response.text();
            expect(data).toBe("Not Found");
        });

        it("should return 500 when there is an error during retrieval", async () => {
            const mockId = 1;

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const response = await GET(new Request(`/api/comment_reply/${mockId}`), { params: { id: `${mockId}` } });

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM comment_reply WHERE comment_reply_id = $1", [mockId]);
            expect(response.status).toBe(500);
            const data = await response.text();
            expect(data).toBe("Failed to retrieve data");
        });
    });
});
