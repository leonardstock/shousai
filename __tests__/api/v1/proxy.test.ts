import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/v1/proxy/route";
import { auth } from "@clerk/nextjs/server";

// Mock dependencies
vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn(() => Promise.resolve({ userId: "test-user-id" })),
}));

vi.mock("@/lib/db/prisma", () => ({
    prisma: {
        usageLog: {
            create: vi.fn(),
        },
    },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Proxy Route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should handle OpenAI requests successfully", async () => {
        // Mock successful OpenAI response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    choices: [
                        {
                            message: {
                                content: "Test response",
                            },
                        },
                    ],
                }),
        });

        const request = new Request("http://localhost:3000/api/v1/proxy", {
            method: "POST",
            body: JSON.stringify({
                apiKey: "test-key",
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: "Hello",
                    },
                ],
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.usage).toBeDefined();
        expect(data.usage.estimated_cost).toBeDefined();
    });

    it("should handle Anthropic requests successfully", async () => {
        // Mock successful Anthropic response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    content: [
                        {
                            text: "Test response",
                        },
                    ],
                }),
        });

        const request = new Request("http://localhost:3000/api/v1/proxy", {
            method: "POST",
            body: JSON.stringify({
                apiKey: "test-key",
                provider: "anthropic",
                model: "claude-3-opus-20240229",
                messages: [
                    {
                        role: "user",
                        content: "Hello",
                    },
                ],
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.usage).toBeDefined();
    });

    it("should handle unauthorized requests", async () => {
        // Mock auth to return no user
        vi.mocked(auth).mockResolvedValueOnce({ userId: null });

        const request = new Request("http://localhost:3000/api/v1/proxy", {
            method: "POST",
            body: JSON.stringify({
                apiKey: "test-key",
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [],
            }),
        });

        const response = await POST(request);
        expect(response.status).toBe(401);
    });

    it("should handle invalid request data", async () => {
        const request = new Request("http://localhost:3000/api/v1/proxy", {
            method: "POST",
            body: JSON.stringify({
                // Missing required fields
                provider: "openai",
            }),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
    });

    it("should handle API errors", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            json: () =>
                Promise.resolve({
                    error: "Rate limit exceeded",
                }),
        });

        const request = new Request("http://localhost:3000/api/v1/proxy", {
            method: "POST",
            body: JSON.stringify({
                apiKey: "test-key",
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: "Hello",
                    },
                ],
            }),
        });

        const response = await POST(request);
        expect(response.status).toBe(429);
    });
});
