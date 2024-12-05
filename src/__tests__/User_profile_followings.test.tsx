import { GET } from "@/app/api/crud/user_profile/followings/[id]/route"; 
import pool from "@/lib/db/pool";


jest.mock("../lib/db/pool");

describe("GET followings API", () => {
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

  it("should return a list of user profiles for a given user ID", async () => {
    const mockRows = [
      {
        user_id: "123",
        user_name: "johndoe",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        gender: "male",
        birth_date: "1990-01-01",
        about: "A sample user",
        profile_pic: "sampleimage",
        pic_mime_type_prefix: "data:image/png;base64,",
      },
    ];

    mockClient.query.mockResolvedValue({ rows: mockRows });

    const params = { id: "456" };
    const request = new Request("http://localhost/api/followings/456");

    const response = await GET(request, { params });
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual([
      {
        userId: "123",
        username: "johndoe",
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        gender: "male",
        birthDate: "1990-01-01",
        about: "A sample user",
        profilePicture: "data:image/png;base64,c2FtcGxlc2FtcGxlaW1hZ2U=",
      },
    ]);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT up.* FROM followings AS f INNER JOIN user_profile AS up ON f.following_id = up.user_id WHERE f.user_id = $1",
      ["456"]
    );
  });

  it("should return a 500 error when there is a database error", async () => {
    mockClient.query.mockRejectedValue(new Error("Database error"));

    const params = { id: "456" };
    const request = new Request("http://localhost/api/followings/456");

    const response = await GET(request, { params });

    expect(response.status).toBe(500);
    const responseText = await response.text();
    expect(responseText).toBe("Internal server error.");
  });

  it("should release the database client after execution", async () => {
    const mockRows = [];
    mockClient.query.mockResolvedValue({ rows: mockRows });

    const params = { id: "456" };
    const request = new Request("http://localhost/api/followings/456");

    await GET(request, { params });

    expect(mockClient.release).toHaveBeenCalled();
  });
});
