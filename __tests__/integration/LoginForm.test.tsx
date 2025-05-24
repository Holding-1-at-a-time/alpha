import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginForm } from "@/components/LoginForm"

// Mock the useAuth hook
vi.mock("@/app/providers/AuthProvider", () => ({
  useAuth: vi.fn().mockReturnValue({
    login: vi.fn().mockResolvedValue({}),
    error: null,
    isLoading: false,
  }),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render the login form", () => {
    render(<LoginForm tenantId="demo" />)

    // Check that the form elements are rendered
    expect(screen.getByText("Sign In")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
  })

  it("should validate email and password", async () => {
    render(<LoginForm tenantId="demo" />)
    const user = userEvent.setup()

    // Try to submit with invalid email
    await user.type(screen.getByLabelText("Email"), "invalid-email")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    // Check that validation error is displayed
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()

    // Clear the form
    await user.clear(screen.getByLabelText("Email"))
    await user.clear(screen.getByLabelText("Password"))

    // Try to submit with short password
    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "12345")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    // Check that validation error is displayed
    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument()
  })

  it("should call login with valid credentials", async () => {
    const { useAuth } = await import("@/app/providers/AuthProvider")
    const mockLogin = vi.fn().mockResolvedValue({})
    ;(useAuth as any).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
    })

    render(<LoginForm tenantId="demo" />)
    const user = userEvent.setup()

    // Fill in valid credentials
    await user.type(screen.getByLabelText("Email"), "test@example.com")
    await user.type(screen.getByLabelText("Password"), "password123")
    await user.click(screen.getByRole("button", { name: "Sign In" }))

    // Check that login was called with the correct arguments
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123", "demo")
    })
  })

  it("should display loading state during login", async () => {
    const { useAuth } = await import("@/app/providers/AuthProvider")
    const mockLogin = vi.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))
    ;(useAuth as any).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: true,
    })

    render(<LoginForm tenantId="demo" />)

    // Check that the button shows loading state
    expect(screen.getByRole("button", { name: "Signing in..." })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Signing in..." })).toBeDisabled()
  })

  it("should display error message", async () => {
    const { useAuth } = await import("@/app/providers/AuthProvider")
    ;(useAuth as any).mockReturnValue({
      login: vi.fn().mockResolvedValue({}),
      error: "Invalid credentials",
      isLoading: false,
    })

    render(<LoginForm tenantId="demo" />)

    // Check that the error message is displayed
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
  })
})
