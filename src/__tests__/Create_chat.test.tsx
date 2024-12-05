import {POST, GET} from "@/app/api/crud/create_chat/route";
import pool from "../lib/db/pool";
import getCurrentSessionUserId from "@/lib/cookies/getCurrentSessionUserId";

jest.mock("../lib/db/pool");
jest.mock("../lib/cookies/getCurrentSessionUserId");

const mockPool = pool as jest.Mocked<typeof pool>;
const mockGetCurrentSessionUserId = getCurrentSessionUserId as jest.MockedFunction<typeof getCurrentSessionUserId>;
describe("create_chat API endpoints", () => {
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

    describe("POST /api/chat", () => {
        it("should create a new chat when no existing chat exists", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            client.query.mockResolvedValueOnce({ rows: [] }); // No existing chat
            client.query.mockResolvedValueOnce({ rows: [{ chat_id: 1 }] }); // New chat ID
            client.query.mockResolvedValueOnce({}); // Insert users into group_members

            const request = new Request("/api/chat", {
                method: "POST",
                body: JSON.stringify({ currentUserId: 1, selectedUserId: 2 }),
            });

            const response = await POST(request);

            expect(client.query).toHaveBeenCalledTimes(3); // Check all queries were run
            expect(client.query).toHaveBeenCalledWith(
                `SELECT chat_id 
             FROM group_members 
             WHERE user_id = $1 AND chat_id IN 
             (SELECT chat_id FROM group_members WHERE user_id = $2)`,
            [1, 2]
            );
            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO chat (chat_name) VALUES ($1) RETURNING chat_id",
                ["Private chat between 1 and 2"]
            );
            expect(client.query).toHaveBeenCalledWith(
                "INSERT INTO group_members (user_id, chat_id) VALUES ($1, $2), ($3, $2)",
                [1, 1, 2]
            );
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toEqual({
                chatId: 1,
                message: "Chat created successfully",
            });
        });

        it("should return existing chat if one already exists", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);
        
            client.query.mockResolvedValueOnce({ rows: [{ chat_id: 1 }] }); // Existing chat
        
            const request = new Request("/api/chat", {
                method: "POST",
                body: JSON.stringify({ currentUserId: 1, selectedUserId: 2 }),
            });
        
            const response = await POST(request);
        
            expect(client.query).toHaveBeenCalledTimes(1);
        
            // Normalize both actual and expected queries
            const actualQuery = normalizeSQL(client.query.mock.calls[0][0]);
            const expectedQuery = normalizeSQL(
                `SELECT chat_id 
                 FROM group_members 
                 WHERE user_id = $1 AND chat_id IN 
                 (SELECT chat_id FROM group_members WHERE user_id = $2)`
            );
        
            expect(actualQuery).toBe(expectedQuery); // Compare normalized queries
            expect(client.query).toHaveBeenCalledWith(expect.any(String), [1, 2]);
            expect(response.status).toBe(200);
        
            const data = await response.json();
            expect(data).toEqual({
                chatId: 1,
                message: "Chat already exists",
            });
        });
        

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const request = new Request("/api/chat", {
                method: "POST",
                body: JSON.stringify({ currentUserId: 1, selectedUserId: 2 }),
            });

            const response = await POST(request);

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 400 if user IDs are missing", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            const request = new Request("/api/chat", {
                method: "POST",
                body: JSON.stringify({}),
            });

            const response = await POST(request);

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data).toEqual({ error: "Missing user IDs" });
        });

        it("should return 500 if there is a database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const request = new Request("/api/chat", {
                method: "POST",
                body: JSON.stringify({ currentUserId: 1, selectedUserId: 2 }),
            });

            const response = await POST(request);

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data).toEqual({ error: "Failed to create chat" });
        });
    });

    describe("GET /api/chat", () => {
        it("should fetch all chats for the current user", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            const mockChats = [
                { chatid: 1, username: "User2", lastmessage: "Hello" },
                { chatid: 2, username: "User3", lastmessage: "Hi" },
            ];

            client.query.mockResolvedValueOnce({ rows: mockChats });

            const response = await GET(new Request("/api/chat"));

            expect(client.query).toHaveBeenCalledWith(
                `SELECT DISTINCT ON (c.chat_id)
            c.chat_id AS chatid, 
            u.user_name AS username, 
            COALESCE(m.messages_text, '') AS lastMessage
        FROM chat c
        JOIN group_members gm ON c.chat_id = gm.chat_id
        JOIN user_profile u ON gm.user_id = u.user_id
        LEFT JOIN LATERAL (
            SELECT m.messages_text
            FROM messages m
            WHERE m.chat_id = c.chat_id
            ORDER BY m.messages_timestamp DESC
            LIMIT 1
        ) m ON true
        WHERE gm.chat_id IN (
            SELECT chat_id 
            FROM group_members 
            WHERE user_id = $1
        ) AND u.user_id != $1;
        `,
                [1]
            );
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual([
                { chatid: 1, username: "User2", lastMessage: "Hello" },
                { chatid: 2, username: "User3", lastMessage: "Hi" },
            ]);
        });

        it("should return 401 if the user is unauthorized", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(-1);

            const response = await GET(new Request("/api/chat"));

            expect(response.status).toBe(401);
            const text = await response.text();
            expect(text).toBe("Unauthorized API call");
        });

        it("should return 500 if there is a database error", async () => {
            mockGetCurrentSessionUserId.mockResolvedValue(1);

            client.query.mockRejectedValueOnce(new Error("Database error"));

            const response = await GET(new Request("/api/chat"));

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data).toEqual({ error: "Failed to fetch chats" });
        });
    });
});
function normalizeSQL(query: string): string {
    return query.replace(/\s+/g, " ").trim();
}
