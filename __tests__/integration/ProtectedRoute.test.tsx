import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import ProtectedRoute from "@/components/ProtectedRoute"

// Mock the useRouter
const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    push: mockPush,
  }),
}))

// Mock the useAuth hook
vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}))

// Mock the logger
vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock the Loading component
vi.mock("@/app/global-components/Loading", () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}))

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render children when authenticated", () => {
    const { useAuth } = require("@/app/providers/AuthProvider")
    useAuth.mockReturnValue({
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
      },
      isLoading: false,
      isAuthenticated: true,
      tenantId: "demo",
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
  })

  it("should render loading when loading", () => {
    const { useAuth } = require("@/app/providers/AuthProvider")
    useAuth.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      tenantId: null,
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  it("should redirect when not authenticated", () => {
    const { useAuth } = require("@/app/providers/AuthProvider")
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      tenantId: "demo",
    })

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    )

    expect(mockPush).toHaveBeenCalledWith("/login?tenant=demo")
  })

  it("should redirect when user doesn't have required role", () => {
    const { useAuth } = require("@/app/providers/AuthProvider")
    useAuth.mockReturnValue({
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "user",
        tenantId: "demo",
      },
      isLoading: false,
      isAuthenticated: true,
      tenantId: "demo",
    })

    render(
      <ProtectedRoute allowedRoles={["admin"]}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    )

    expect(mockPush).toHaveBeenCalledWith("/demo/dashboard")
  })

  it("should render children when user has required role", () => {
    const { useAuth } = require("@/app/providers/AuthProvider")
    useAuth.mockReturnValue({
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
      },
      isLoading: false,
      isAuthenticated: true,
      tenantId: "demo",
    })

    render(
      <ProtectedRoute allowedRoles={["admin", "manager"]}>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>,
    )

    expect(screen.getByTestId("protected-content")).toBeInTheDocument()
  })
})
