import { GET } from "@/app/api/crud/posts/voteCounts/[id]/route";
import pool from "@/lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("/api/post_votes/:id API endpoint", () => {
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

    it("should return the vote count for a given post with status 200", async () => {
        const mockData = [{ count: "5" }]; // Mock database response with a vote count of 5
        client.query.mockResolvedValueOnce({ rows: mockData });

        const request = new Request("http://localhost/api/post_votes/101");
        const params = { params: { id: "101" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM post_vote WHERE post_id = $1", ["101"]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ count: 5 });
    });

    it("should return a count of 0 if there are no votes for the given post", async () => {
        const mockData = [{ count: "0" }]; // Mock database response with a count of 0
        client.query.mockResolvedValueOnce({ rows: mockData });

        const request = new Request("http://localhost/api/post_votes/999");
        const params = { params: { id: "999" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM post_vote WHERE post_id = $1", ["999"]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ count: 0 });
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("http://localhost/api/post_votes/101");
        const params = { params: { id: "101" } };

        const response = await GET(request, params);

        expect(client.query).toHaveBeenCalledWith("SELECT COUNT(*) FROM post_vote WHERE post_id = $1", ["101"]);
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal server error");
    });
});
