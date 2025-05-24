"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTenant } from "@/lib/tenantContext"
import { logger } from "@/lib/logger"
import { initializeAuth, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const tenant = useTenant()

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        const auth = await initializeAuth()

        // Check if user is already authenticated
        const currentUser = await auth.getCurrentUser()

        if (currentUser) {
          // Validate that the user has access to this tenant
          if (tenant && tenant.id && currentUser.tenantId !== tenant.id) {
            logger.warn("User does not have access to this tenant", {
              userId: currentUser.id,
              userTenant: currentUser.tenantId,
              requestedTenant: tenant.id,
            })
            await auth.logout()
            setUser(null)
            if (!pathname.startsWith("/login")) {
              router.push("/login")
            }
          } else {
            setUser(currentUser)
          }
        } else if (isProtectedRoute(pathname)) {
          // Redirect to login if not authenticated and trying to access protected route
          const loginUrl =
            tenant && tenant.id
              ? `/login?tenant=${tenant.id}&redirect=${encodeURIComponent(pathname)}`
              : `/login?redirect=${encodeURIComponent(pathname)}`
          router.push(loginUrl)
        }
      } catch (err) {
        logger.error("Error initializing auth", err as Error)
        setError("Failed to initialize authentication")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [pathname, router, tenant])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const auth = await initializeAuth()
      const user = await auth.login(email, password, tenant?.id)
      setUser(user)

      // Get redirect URL from query params or default to tenant home
      const params = new URLSearchParams(window.location.search)
      const redirectUrl = params.get("redirect") || `/${tenant?.id || ""}`
      router.push(redirectUrl)
    } catch (err) {
      logger.error("Login failed", err as Error)
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithProvider = async (provider: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const auth = await initializeAuth()
      await auth.loginWithProvider(provider, tenant?.id)
      // The page will be redirected by the provider, so we don't need to do anything else here
    } catch (err) {
      logger.error(`Login with ${provider} failed`, err as Error)
      setError(`Failed to login with ${provider}`)
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      const auth = await initializeAuth()
      await auth.logout()
      setUser(null)
      router.push("/")
    } catch (err) {
      logger.error("Logout failed", err as Error)
      setError("Failed to logout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithProvider,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to determine if a route should be protected
function isProtectedRoute(pathname: string): boolean {
  // Exclude public routes
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/docs", "/pricing"]

  // Check if the path is in the public routes list
  for (const route of publicRoutes) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return false
    }
  }

  // Consider all other routes as protected
  return true
}
