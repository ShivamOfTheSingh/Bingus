import { GET } from "@/app/api/crud/post_comment/voteCounts/[id]/route";
import pool from "../lib/db/pool";

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

    it("should return the count of votes for a specific post comment with status 200", async () => {
        client.query.mockResolvedValueOnce({ rows: [{ count: "5" }] });

        const request = new Request("/api/comment_vote/101");
        const response = await GET(request, { params: { id: "101" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM comment_vote WHERE post_comment_id = $1",
            ["101"]
        );
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual({ count: 5 });
    });

    it("should return 0 if there are no votes for the specified post comment", async () => {
        client.query.mockResolvedValueOnce({ rows: [{ count: "0" }] });

        const request = new Request("/api/comment_vote/999");
        const response = await GET(request, { params: { id: "999" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM comment_vote WHERE post_comment_id = $1",
            ["999"]
        );
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data).toEqual({ count: 0 });
    });

    it("should return 500 on database error", async () => {
        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request("/api/comment_vote/101");
        const response = await GET(request, { params: { id: "101" } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM comment_vote WHERE post_comment_id = $1",
            ["101"]
        );
        expect(response.status).toBe(500);

        const text = await response.text();
        expect(text).toBe("Internal server error");
    });
});
