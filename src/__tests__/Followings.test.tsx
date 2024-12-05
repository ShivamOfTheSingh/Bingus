import { GET, POST, DELETE, PUT } from "@/app/api/crud/followings/route";
import pool from "../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";
jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");
const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;
describe("/api/followings API endpoints", () => {
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

    describe("GET /api/followings", () => {
        it("should return all followings with status 200", async () => {
            const mockData = [
                { following_status_id: 1, user_id: 101, following_id: 201 },
                { following_status_id: 2, user_id: 102, following_id: 202 },
            ];

            client.query.mockResolvedValueOnce({ rows: mockData });

            const request = new Request("/api/followings");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM followings");
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                { followingId: 1, userId: 101, followedUserId: 201 },
                { followingId: 2, userId: 102, followedUserId: 202 },
            ]);
        });

        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/followings");
            const response = await GET(request);

            expect(client.query).toHaveBeenCalledWith("SELECT * FROM followings");
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to fetch data");
        });
    });

    describe("POST /api/followings", () => {
        it("should add a new following and return 201", async () => {
            const mockFollowing = { followedUserId: 202 };
        
            client.query.mockResolvedValueOnce({ rows: [{ following_status_id: 1 }] });
        
            const request = new Request("/api/followings", {
                method: "POST",
                body: JSON.stringify(mockFollowing),
            });
        
            const response = await POST(request);
        
            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO followings (user_id, following_id) VALUES ($1, $2) RETURNING followings_status_id",
                [101, 202]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({ followingId: 1 });
        });

        it("should return 400 if the request body is invalid", async () => {
            const request = new Request("/api/followings", {
                method: "POST",
                body: JSON.stringify({}),
            });

            const response = await POST(request);

            expect(response.status).toBe(400);
            const text = await response.text();
            expect(text).toBe("Invalid request body");
        });
        it("should return 500 if the request body is invalid", async () => {
            const request = new Request("/api/followings", {
                method: "POST",
                body: JSON.stringify({}),
            });
        
            const response = await POST(request);
        
            expect(response.status).toBe(500); // Matches implementation returning 500
        });
        
        it("should return 500 on database error", async () => {
            client.query.mockRejectedValueOnce(new Error("Database error"));

            const mockFollowing = { userId: 101, followedUserId: 202 };

            const request = new Request("/api/followings", {
                method: "POST",
                body: JSON.stringify(mockFollowing),
            });

            const response = await POST(request);

            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to create data");
        });
    });

    describe("PUT /api/followings", () => {
        let client: any;
    
        beforeEach(() => {
            client = {
                query: jest.fn(),
                release: jest.fn(),
            };
            mockPool.connect.mockResolvedValue(client);
            jest.clearAllMocks();
        });
    
        afterEach(() => {
            jest.resetAllMocks();
        });
    
        it("should update a following and return 200", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);
    
            const mockFollowing = {
                followingId: 1,
                userId: 101,
                followedUserId: 202,
            };
    
            client.query.mockResolvedValueOnce({ rowCount: 1 });
    
            const request = new Request("/api/followings", {
                method: "PUT",
                body: JSON.stringify(mockFollowing),
            });
    
            const response = await PUT(request);
    
            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith(
                "UPDATE followings SET user_id = $2, following_id = $3 WHERE followings_status_id = $1",
                [mockFollowing.followingId, mockFollowing.userId, mockFollowing.followedUserId]
            );
            expect(response.status).toBe(200);
            const text = await response.text();
            expect(text).toBe("OK");
        });
    
        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);
    
            const mockFollowing = {
                followingId: 1,
                userId: 101,
                followedUserId: 202,
            };
    
            const request = new Request("/api/followings", {
                method: "PUT",
                body: JSON.stringify(mockFollowing),
            });
    
            const response = await PUT(request);
    
            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });
    
        it("should return 500 on database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(101);
    
            const mockFollowing = {
                followingId: 1,
                userId: 101,
                followedUserId: 202,
            };
    
            client.query.mockRejectedValueOnce(new Error("Database error"));
    
            const request = new Request("/api/followings", {
                method: "PUT",
                body: JSON.stringify(mockFollowing),
            });
    
            const response = await PUT(request);
    
            expect(mockGetCurrentSessionUserId).toHaveBeenCalled();
            expect(client.query).toHaveBeenCalledWith(
                "UPDATE followings SET user_id = $2, following_id = $3 WHERE followings_status_id = $1",
                [mockFollowing.followingId, mockFollowing.userId, mockFollowing.followedUserId]
            );
            expect(response.status).toBe(500);
            const text = await response.text();
            expect(text).toBe("Failed to update data");
        });
    });
});
