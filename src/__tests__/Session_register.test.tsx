import { POST } from "@/app/api/session/register/route";
import pool from "@/lib/db/pool";
import bcrypt from "bcrypt";

jest.mock("../lib/db/pool");
jest.mock("bcrypt");

describe("POST register API", () => {
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

  it("should register a user successfully", async () => {
    const mockUserAuth = {
      userId: 1,
      password: "password123",
      dateRegistered: "2024-12-04",
    };

    const mockRequest = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockUserAuth),
    });

    mockClient.query.mockResolvedValueOnce({ rows: [] }); // No user exists
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const response = await POST(mockRequest);

    expect(response.status).toBe(201);
    expect(response.text()).resolves.toBe("User successfully registered");
    expect(mockClient.query).toHaveBeenCalledTimes(2);
    expect(mockClient.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM user_auth WHERE user_id = $1",
      [1]
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      `
                INSERT INTO user_auth
                (
                    user_password,
                    date_registered,
                    user_id
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
            `,
      ["hashedPassword", "2024-12-04", 1]
    );
  });

  it("should return 409 if user already exists", async () => {
    const mockUserAuth = {
      userId: 1,
      password: "password123",
      dateRegistered: "2024-12-04",
    };

    const mockRequest = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockUserAuth),
    });

    mockClient.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });

    const response = await POST(mockRequest);

    expect(response.status).toBe(409);
    expect(response.text()).resolves.toBe("User already exists");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM user_auth WHERE user_id = $1",
      [1]
    );
  });

  it("should return 500 for internal server error", async () => {
    const mockUserAuth = {
      userId: 1,
      password: "password123",
      dateRegistered: "2024-12-04",
    };

    const mockRequest = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify(mockUserAuth),
    });

    mockClient.query.mockRejectedValue(new Error("Database error"));

    const response = await POST(mockRequest);

    expect(response.status).toBe(500);
    expect(response.text()).resolves.toBe("Internal Server Error");
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });
});
