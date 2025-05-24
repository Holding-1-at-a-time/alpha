"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers/AuthProvider"
import { useTenant } from "@/lib/tenantContext"
import { logger } from "@/lib/logger"
import Loading from "@/app/global-components/Loading"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const tenant = useTenant()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logger.info("Unauthenticated user attempting to access protected route")
      const loginUrl = tenant?.id
        ? `/login?tenant=${tenant.id}&redirect=${encodeURIComponent(window.location.pathname)}`
        : `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      router.push(loginUrl)
      return
    }

    // Check role-based access if roles are specified
    if (!isLoading && isAuthenticated && allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.role || "user"

      if (!allowedRoles.includes(userRole)) {
        logger.warn("User does not have required role to access this route", {
          userId: user?.id,
          userRole,
          requiredRoles: allowedRoles,
        })
        router.push(`/${tenant?.id || ""}`)
      }
    }
  }, [isLoading, isAuthenticated, router, user, allowedRoles, tenant])

  // Show loading state while checking authentication
  if (isLoading) {
    return <Loading />
  }

  // If not authenticated, don't render children (will redirect in useEffect)
  if (!isAuthenticated) {
    return <Loading />
  }

  // If role check is required and user doesn't have the required role, don't render children
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || "user"
    if (!allowedRoles.includes(userRole)) {
      return <Loading />
    }
  }

  // User is authenticated and has the required role, render children
  return <>{children}</>
}
