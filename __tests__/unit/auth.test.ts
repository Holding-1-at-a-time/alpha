import { describe, it, expect, vi, beforeEach } from "vitest"
import { validateEmail, registerUser, getUserProfile } from "@/lib/auth"

// Mock the ConvexHttpClient
vi.mock("convex/browser", () => ({
  ConvexHttpClient: vi.fn().mockImplementation(() => ({
    mutation: vi.fn().mockResolvedValue({ userId: "user_123" }),
    query: vi.fn().mockResolvedValue({
      id: "user_123",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
      tenantId: "demo",
    }),
  })),
}))

// Mock the logger
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}))

describe("Auth Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("validateEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true)
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true)
    })

    it("should return false for invalid email addresses", () => {
      expect(validateEmail("not-an-email")).toBe(false)
      expect(validateEmail("@missing-username.com")).toBe(false)
      expect(validateEmail("missing-domain@")).toBe(false)
      expect(validateEmail("missing-dot@domain")).toBe(false)
    })
  })

  describe("registerUser", () => {
    it("should register a user successfully", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        tenantId: "demo",
        authProviderId: "credentials|test@example.com",
        role: "user",
      }

      const result = await registerUser(userData)
      expect(result).toEqual({ userId: "user_123" })
    })
  })

  describe("getUserProfile", () => {
    it("should get a user profile successfully", async () => {
      const result = await getUserProfile("user_123")
      expect(result).toEqual({
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
      })
    })
  })
})
