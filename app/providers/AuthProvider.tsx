"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { logger } from "@/lib/logger"
import { validateSession } from "@/lib/auth"
import type { User } from "@/types/next-auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  tenantId: string | null
  login: (email: string, password: string, tenantId: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialTenantId,
}: {
  children: ReactNode
  initialTenantId?: string
}) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId || null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "loading") return

    if (session?.user) {
      setUser(session.user as User)
      if (session.user.tenantId) {
        setTenantId(session.user.tenantId)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string, tenantId: string) => {
    try {
      setIsLoading(true)
      // Login logic here
      logger.info("User logged in", { email, tenantId })
    } catch (error) {
      logger.error("Login failed", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      // Logout logic here
      setUser(null)
      setTenantId(null)
      router.push("/login")
    } catch (error) {
      logger.error("Logout failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setUser(null)
        return
      }

      const result = await validateSession(token)
      if (result.valid && result.user) {
        setUser(result.user)
        setTenantId(result.tenantId || null)
      } else {
        setUser(null)
        localStorage.removeItem("authToken")
      }
    } catch (error) {
      logger.error("Auth check failed", error)
      setUser(null)
    }
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    tenantId,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
