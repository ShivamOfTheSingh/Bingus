import { GET } from "@/app/api/crud/media/[id]/route";
import pool from "../lib/db/pool";
import { Media } from "@/lib/db/models";

jest.mock("../lib/db/pool");

const mockPool = pool as jest.Mocked<typeof pool>;

describe("GET /api/media/:id", () => {
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

    it("should return a media record when it exists", async () => {
        const mockId = 1;
        const mockMedia = {
            media_id: mockId,
            post_id: 101,
            media_url: Buffer.from("test-media", "utf-8").toString("base64"),
            mime_type_prefix: "data:image/png;base64,",
        };

        client.query.mockResolvedValueOnce({ rows: [mockMedia] });

        const request = new Request(`/api/media/${mockId}`);
        const response = await GET(request, { params: { id: mockId.toString() } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM media WHERE media_id = $1", [mockId]);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({
            mediaId: mockMedia.media_id,
            postId: mockMedia.post_id,
            mediaUrl: mockMedia.mime_type_prefix + mockMedia.media_url,
        });
    });

    it("should return 404 if the media record does not exist", async () => {
        const mockId = 2;

        client.query.mockResolvedValueOnce({ rows: [] });

        const request = new Request(`/api/media/${mockId}`);
        const response = await GET(request, { params: { id: mockId.toString() } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM media WHERE media_id = $1", [mockId]);
        expect(response.status).toBe(404);
        const text = await response.text();
        expect(text).toBe("Media record not found");
    });

    it("should return 500 on database error", async () => {
        const mockId = 3;

        client.query.mockRejectedValueOnce(new Error("Database error"));

        const request = new Request(`/api/media/${mockId}`);
        const response = await GET(request, { params: { id: mockId.toString() } });

        expect(client.query).toHaveBeenCalledWith("SELECT * FROM media WHERE media_id = $1", [mockId]);
        expect(response.status).toBe(500);
        const text = await response.text();
        expect(text).toBe("Failed to retrieve data");
    });
});
