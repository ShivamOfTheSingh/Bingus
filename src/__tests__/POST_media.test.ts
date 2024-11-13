import { POST } from "@/app/api/crud/media/route"; // Adjust to the correct import path
import pool from "@/lib/db/pool"; // Adjust to the correct import path
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId"; // Adjust to the correct import path

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

describe('POST API', () => {
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

  it('should return status 201 and mediaId on successful media creation', async () => {
    const mockMedia = {
      postId: 10,
      mediaUrl: 'data:image/jpeg;base64,aW1hZ2Uvc3Rvcnk=',
    };

    const mockRows = [
      { media_id: 123 },
    ];

    mockClient.query.mockResolvedValue({ rows: mockRows });
    (getCurrentSessionUserId as jest.Mock).mockResolvedValue(1); // Simulate logged-in user

    const request = new Request('http://localhost/media', {
      method: 'POST',
      body: JSON.stringify(mockMedia),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ mediaId: 123 });
    expect(mockClient.query).toHaveBeenCalledWith(
      "INSERT INTO media (post_id, media_url, mime_type_prefix) VALUES ($1, $2, $3) RETURNING media_id",
      [mockMedia.postId, Buffer.from('aW1hZ2Uvc3Rvcnk=', 'base64'), 'data:image/jpeg;base64,']
    );
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return status 401 if the user is not authorized', async () => {
    const mockMedia = {
      postId: 10,
      mediaUrl: 'data:image/jpeg;base64,aW1hZ2Uvc3Rvcnk=',
    };

    (getCurrentSessionUserId as jest.Mock).mockResolvedValue(-1); // Simulate unauthorized user

    const request = new Request('http://localhost/media', {
      method: 'POST',
      body: JSON.stringify(mockMedia),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.text();

    expect(response.status).toBe(401);
    expect(data).toBe('Unauthorized API call');
  });

  it('should return status 500 if the database query fails', async () => {
    const mockMedia = {
      postId: 10,
      mediaUrl: 'data:image/jpeg;base64,aW1hZ2Uvc3Rvcnk=',
    };

    (getCurrentSessionUserId as jest.Mock).mockResolvedValue(1); // Simulate logged-in user
    mockClient.query.mockRejectedValue(new Error('Database error')); // Simulate query failure

    const request = new Request('http://localhost/media', {
      method: 'POST',
      body: JSON.stringify(mockMedia),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.text();

    expect(response.status).toBe(500);
    expect(data).toBe('Failed to create data');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('should return status 400 if the media data is invalid', async () => {
    const invalidMedia = { // Invalid media with missing postId
      mediaUrl: 'data:image/jpeg;base64,aW1hZ2Uvc3Rvcnk=',
    };

    const request = new Request('http://localhost/media', {
      method: 'POST',
      body: JSON.stringify(invalidMedia),
      headers: { 'Content-Type': 'application/json' },
    });

    // Simulate an unauthorized user for additional testing
    (getCurrentSessionUserId as jest.Mock).mockResolvedValue(1);

    const response = await POST(request);
    const data = await response.text();

    // Expecting a 400 response due to missing postId or other validation errors
    expect(response.status).toBe(400);
    expect(data).toBe('Invalid media data');
  });
});
