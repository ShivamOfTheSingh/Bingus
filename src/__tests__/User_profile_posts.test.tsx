import { GET } from "@/app/api/crud/user_profile/posts/[id]/route"; 
import pool from "@/lib/db/pool";


jest.mock("../lib/db/pool");

describe("GET posts API", () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of posts for a given user ID", async () => {
    const mockRows = [
      {
        post_id: 1,
        user_id: 456,
        caption: "First post",
        date_posted: "2024-12-01T00:00:00.000Z",
      },
      {
        post_id: 2,
        user_id: 456,
        caption: "Second post",
        date_posted: "2024-12-02T00:00:00.000Z",
      },
    ];

    mockClient.query.mockResolvedValue({ rows: mockRows });

    const params = { id: "456" };
    const request = new Request("http://localhost/api/posts/456");

    const response = await GET(request, { params });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual([
      {
        postId: 1,
        userId: 456,
        caption: "First post",
        datePosted: "2024-12-01T00:00:00.000Z",
      },
      {
        postId: 2,
        userId: 456,
        caption: "Second post",
        datePosted: "2024-12-02T00:00:00.000Z",
      },
    ]);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM posts WHERE user_id = $1",
      [456]
    );
  });

  it("should return a 500 error when there is a database error", async () => {
    mockClient.query.mockRejectedValue(new Error("Database error"));

    const params = { id: "456" };
    const request = new Request("http://localhost/api/posts/456");

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const responseText = await response.text();
    expect(responseText).toBe("Failed to fetch data");
  });

  it("should release the database client after execution", async () => {
    const mockRows = [];
    mockClient.query.mockResolvedValue({ rows: mockRows });

    const params = { id: "456" };
    const request = new Request("http://localhost/api/posts/456");

    await GET(request, { params });

    expect(mockClient.release).toHaveBeenCalled();
  });
});
