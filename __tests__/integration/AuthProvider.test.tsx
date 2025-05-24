"use client"

import type React from "react"

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { AuthProvider, useAuth } from "@/app/providers/AuthProvider"

// Mock the next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
  }),
  usePathname: vi.fn().mockReturnValue("/demo/dashboard"),
}))

// Mock the ConvexReactClient
vi.mock("convex/react", () => ({
  ConvexProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ConvexReactClient: vi.fn().mockImplementation(() => ({})),
}))

// Mock the next-auth/react
vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSession: vi.fn().mockReturnValue({
    data: {
      user: {
        id: "user_123",
        name: "Test User",
        email: "test@example.com",
        role: "admin",
        tenantId: "demo",
        image: null,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    status: "authenticated",
  }),
}))

// Mock the auth.ts
vi.mock("@/app/auth", () => ({
  signIn: vi.fn().mockResolvedValue({ error: null }),
  signOut: vi.fn().mockResolvedValue({}),
}))

// Test component that uses the auth context
function TestComponent() {
  const { user, isAuthenticated, tenantId, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "Authenticated" : "Not Authenticated"}</div>
      {user && (
        <div>
          <div data-testid="user-name">{user.name}</div>
          <div data-testid="user-email">{user.email}</div>
          <div data-testid="user-role">{user.role}</div>
          <div data-testid="tenant-id">{tenantId}</div>
        </div>
      )}
      <button onClick={() => login("test@example.com", "password123", "demo")}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should provide authentication context to children", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Check that the auth status is displayed
    expect(screen.getByTestId("auth-status")).toHaveTextContent("Authenticated")

    // Check that the user information is displayed
    expect(screen.getByTestId("user-name")).toHaveTextContent("Test User")
    expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com")
    expect(screen.getByTestId("user-role")).toHaveTextContent("admin")
    expect(screen.getByTestId("tenant-id")).toHaveTextContent("demo")
  })

  it("should call login when login button is clicked", async () => {
    const { signIn } = await import("@/app/auth")
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Click the login button
    await user.click(screen.getByText("Login"))

    // Check that signIn was called
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "test@example.com",
        password: "password123",
        tenantId: "demo",
      })
    })
  })

  it("should call logout when logout button is clicked", async () => {
    const { signOut } = await import("@/app/auth")
    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    )

    // Click the logout button
    await user.click(screen.getByText("Logout"))

    // Check that signOut was called
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ redirect: false })
    })
  })
})
