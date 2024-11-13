import { GET } from "@/app/api/crud/media/route"; // Adjust the import according to your setup
import pool from "@/lib/db/pool";// Adjust to the correct path where your `pool` is imported

jest.mock("../lib/db/pool");

describe('GET /media', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear mock calls after each test
  });

  it('should return media list with status 200 on successful query', async () => {
    const mockRows = [
      {
        media_id: 1,
        post_id: 10,
        mime_type_prefix: 'image/jpeg',
        media_url: 'aW1hZ2Uvc3Rvcnk=',
      },
      {
        media_id: 2,
        post_id: 20,
        mime_type_prefix: 'image/png',
        media_url: 'aW1hZ2UvdXBsYWNhdGlvbg==',
      }
    ];

    mockClient.query.mockResolvedValue({ rows: mockRows });

    const request = new Request('http://localhost/media');
    const response = await GET(request);

    // Parse the response body for easy verification
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      mediaId: 1,
      postId: 10,
      mediaUrl: 'image/jpegaW1hZ2Uvc3Rvcnk=',
    });
    expect(data[1]).toEqual({
      mediaId: 2,
      postId: 20,
      mediaUrl: 'image/pngaW1hZ2UvdXBsYWNhdGlvbg==',
    });
    expect(mockClient.query).toHaveBeenCalledWith("SELECT * FROM media");
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return status 500 if the query fails', async () => {
    mockClient.query.mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/media');
    const response = await GET(request);

    const data = await response.text();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toBe('Failed to fetch data');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should handle client connection failure gracefully', async () => {
    (pool.connect as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    const request = new Request('http://localhost/media');
    const response = await GET(request);

    const data = await response.text();

    // Assertions
    expect(response.status).toBe(500);
    expect(data).toBe('Failed to fetch data');
  });
});
