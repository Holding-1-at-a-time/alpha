"use client"

import { type ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { logger } from "@/lib/logger"
import Loading from "@/app/global-components/Loading"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, tenantId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.info("User not authenticated, redirecting to login")
      router.push(`${redirectTo}?tenant=${tenantId || "demo"}`)
      return
    }

    if (!isLoading && isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
          logger.warn(`User ${user.id} does not have required role, redirecting`, {
            userRole: user.role,
            requiredRoles: allowedRoles,
          })
          router.push(`/${tenantId || "demo"}/dashboard`)
    }

  }, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo, tenantId])

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
