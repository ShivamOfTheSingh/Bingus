import { GET } from "@/app/api/crud/posts/[id]/route";
import pool from "@/lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/posts/:id API endpoint", () => {
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

    it("should return a single post with status 200", async () => {
        const mockData = {
            post_id: 1,
            user_id: 101,
            caption: "Test Post",
            date_posted: "2023-12-01T12:34:56.000Z",
        };

        client.query.mockResolvedValueOnce({ rows: [mockData] });

        const request = new Request("http://localhost/api/posts/1");
        const params = { params: { id: "1" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM posts WHERE post_id = $1", [1]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            postId: 1,
            userId: 101,
            caption: "Test Post",
            datePosted: new Date(mockData.date_posted).toISOString(),
        });
    });

    it("should return 404 if the post is not found", async () => {
        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request("http://localhost/api/posts/999");
        const params = { params: { id: "999" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM posts WHERE post_id = $1", [999]);
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Post record not found");
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("http://localhost/api/posts/1");
        const params = { params: { id: "1" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM posts WHERE post_id = $1", [1]);
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});
