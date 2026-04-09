import { apiFetch, ApiError } from "./client";

// Mock secure store
jest.mock("@/lib/auth/storage", () => ({
  getToken: jest.fn().mockResolvedValue("test-token"),
  clearToken: jest.fn(),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("apiFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sends Authorization header with token", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: "test" }),
    });

    await apiFetch("/things");

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/things"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad request" }),
    });

    await expect(apiFetch("/things")).rejects.toThrow(ApiError);
  });

  it("clears token and throws on 401", async () => {
    const { clearToken } = require("@/lib/auth/storage");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" }),
    });

    await expect(apiFetch("/things")).rejects.toThrow("Unauthorized");
    expect(clearToken).toHaveBeenCalled();
  });

  it("returns undefined for 204 responses", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await apiFetch("/things/1", { method: "DELETE" });
    expect(result).toBeUndefined();
  });

  it("stringifies body for POST requests", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: "1" }),
    });

    await apiFetch("/things", {
      method: "POST",
      body: { label: "Exercise" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ label: "Exercise" }),
      })
    );
  });
});
