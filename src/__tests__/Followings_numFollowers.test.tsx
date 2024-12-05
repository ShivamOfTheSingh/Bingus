import { GET } from "@/app/api/crud/followings/numFollowers/[id]/route";
import pool from "../lib/db/pool";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/followers/:id", () => {
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

    it("should return the count of followers for a valid user ID", async () => {
        const mockId = "101";
        const mockCount = { count: "5" };

        client.query.mockResolvedValueOnce({ rows: [mockCount] });

        const request = new Request(`/api/followers/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM followings WHERE following_id = $1",
            [parseInt(mockId)]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ count: "5" });
    });

    it("should return 0 followers if the user has no followers", async () => {
        const mockId = "102";

        client.query.mockResolvedValueOnce({ rows: [{ count: "0" }] });

        const request = new Request(`/api/followers/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM followings WHERE following_id = $1",
            [parseInt(mockId)]
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ count: "0" });
    });

    it("should return status 500 on database error", async () => {
        const mockId = "103";

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request(`/api/followers/${mockId}`);
        const response = await GET(request, { params: { id: mockId } });

        expect(client.query).toHaveBeenCalledWith(
            "SELECT COUNT(*) FROM followings WHERE following_id = $1",
            [parseInt(mockId)]
        );
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Internal server error");
    });
});
