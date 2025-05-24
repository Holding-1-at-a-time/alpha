"use client"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ConvexProvider } from "convex/react"
import { ConvexReactClient } from "convex/react"
import { logger } from "@/lib/logger"

// Update the ConvexReactClient initialization with proper validation
// Replace the current initialization at the top of the file:

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convex =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexReactClient(convexUrl) : null

// Auth context type definition
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  tenantId: string | null
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

// User type definition
export type User = {
  id: string
  name: string | null
  email: string
  role: string
  tenantId: string
  image?: string | null
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
  initialTenantId?: string
}

export function AuthProvider({ children, initialTenantId }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId || null)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session in localStorage or cookies
        const token = localStorage.getItem("auth_token")

        if (token) {
          // In a real implementation, validate the token and fetch user data
          // For now, we'll simulate a successful auth
          const userData: User = {
            id: "user_123",
            name: "Demo User",
            email: "user@example.com",
            role: "admin",
            tenantId: tenantId || "demo",
            image: null,
          }
          setUser(userData)
        }
      } catch (err) {
        logger.error("Auth initialization error", err as Error)
        setError("Failed to initialize authentication")
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [tenantId])

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real implementation, this would call your auth provider's API
      // For now, we'll simulate a successful login
      if (email && password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Store token in localStorage
        localStorage.setItem("auth_token", "mock_token_123")

        // Set user data
        const userData: User = {
          id: "user_123",
          name: email.split("@")[0],
          email,
          role: "admin",
          tenantId: tenantId || "demo",
          image: null,
        }
        setUser(userData)

        // Redirect to dashboard
        router.push(`/${tenantId || "demo"}/dashboard`)
      } else {
        throw new Error("Email and password are required")
      }
    } catch (err) {
      logger.error("Login error", err as Error)
      setError((err as Error).message || "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  // Login with OAuth provider
  const loginWithProvider = async (provider: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real implementation, this would redirect to the OAuth provider
      // For now, we'll simulate a successful login

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store token in localStorage
      localStorage.setItem("auth_token", "mock_token_123")

      // Set user data
      const userData: User = {
        id: "user_123",
        name: "OAuth User",
        email: "oauth@example.com",
        role: "admin",
        tenantId: tenantId || "demo",
        image: null,
      }
      setUser(userData)

      // Redirect to dashboard
      router.push(`/${tenantId || "demo"}/dashboard`)
    } catch (err) {
      logger.error(`Login with ${provider} error`, err as Error)
      setError(`Failed to login with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true)

      // Clear token from localStorage
      localStorage.removeItem("auth_token")

      // Clear user data
      setUser(null)

      // Redirect to home
      router.push("/")
    } catch (err) {
      logger.error("Logout error", err as Error)
      setError("Failed to logout")
    } finally {
      setIsLoading(false)
    }
  }

  // Update tenant ID when it changes
  useEffect(() => {
    if (initialTenantId && initialTenantId !== tenantId) {
      setTenantId(initialTenantId)
    }
  }, [initialTenantId, tenantId])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    tenantId,
    login,
    loginWithProvider,
    logout,
    error,
  }

  // Then update the ConvexProvider usage in the return statement:

  return (
    <AuthContext.Provider value={value}>
      {convex ? (
        <ConvexProvider client={convex}>{children}</ConvexProvider>
      ) : (
        <div className="container flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold">Configuration Error</h1>
          <p className="mt-4 text-muted-foreground">
            The Convex URL is not properly configured. Please check your environment variables.
          </p>
        </div>
      )}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
