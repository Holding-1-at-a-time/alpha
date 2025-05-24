"use client"

import { type ReactNode, createContext, useContext, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ConvexProvider } from "convex/react"
import { ConvexReactClient } from "convex/react"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { logger } from "@/lib/logger"

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
  login: (email: string, password: string, tenantId: string) => Promise<void>
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

// Auth provider wrapper component
export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {convex ? (
        <ConvexProvider client={convex}>
          <AuthProviderInternal>{children}</AuthProviderInternal>
        </ConvexProvider>
      ) : (
        <div className="container flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold">Configuration Error</h1>
          <p className="mt-4 text-muted-foreground">
            The Convex URL is not properly configured. Please check your environment variables.
          </p>
        </div>
      )}
    </SessionProvider>
  )
}

// Internal auth provider that uses NextAuth session
function AuthProviderInternal({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Get tenant ID from URL if available
  const pathTenantId = pathname?.split("/")[1]
  const tenantId = session?.user?.tenantId || pathTenantId || null

  // Convert NextAuth session to our User type
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email || "",
        role: session.user.role,
        tenantId: session.user.tenantId,
        image: session.user.image,
      }
    : null

  // Login with email and password
  const login = async (email: string, password: string, tenantId: string) => {
    try {
      setError(null)
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        tenantId,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect to dashboard
      router.push(`/${tenantId}/dashboard`)
    } catch (err) {
      logger.error("Login error", err as Error)
      setError((err as Error).message || "Failed to login")
      throw err
    }
  }

  // Login with OAuth provider
  const loginWithProvider = async (provider: string) => {
    try {
      setError(null)
      await signIn(provider, { callbackUrl: `/${tenantId || "demo"}/dashboard` })
    } catch (err) {
      logger.error(`Login with ${provider} error`, err as Error)
      setError(`Failed to login with ${provider}`)
      throw err
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
    } catch (err) {
      logger.error("Logout error", err as Error)
      setError("Failed to logout")
      throw err
    }
  }

  const value = {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    tenantId,
    login,
    loginWithProvider,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export the wrapper as AuthProvider for backward compatibility
export const AuthProvider = AuthProviderWrapper
