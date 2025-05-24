"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { NextRequest } from "next/server"
import { logger } from "./logger"

export interface TenantMeta {
  id: string
  name?: string
  logo?: string
  primaryColor?: string
  features?: string[]
}

interface TenantContextType {
  tenant: TenantMeta
}

// Define TenantContext at the module level
const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({
  children,
  tenantId,
}: {
  children: ReactNode
  tenantId: string
}) {
  // In a real app, you would fetch tenant metadata from your database
  // For now, we'll create a simple tenant object
  const tenant: TenantMeta = {
    id: tenantId,
    name: tenantId.charAt(0).toUpperCase() + tenantId.slice(1),
    primaryColor: "#3b82f6", // Default to blue
    features: ["dashboard", "projects", "team"],
  }

  logger.info(`TenantProvider initialized with tenant: ${tenantId}`)

  return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context.tenant
}

export function getTenantFromRequest(request: NextRequest): string | null {
  // First try to get from existing cookie
  const tenantFromCookie = request.cookies.get("tenantId")?.value
  if (tenantFromCookie) {
    return tenantFromCookie
  }

  // Then try to extract from hostname (subdomain)
  const hostname = request.headers.get("host") || ""
  const parts = hostname.split(".")

  // Check if we have a subdomain
  if (parts.length > 2) {
    const subdomain = parts[0]
    // Ignore 'www' as a tenant
    if (subdomain !== "www") {
      return subdomain
    }
  }

  // Finally, try to extract from path
  const pathParts = request.nextUrl.pathname.split("/")
  if (pathParts.length > 1 && pathParts[1]) {
    return pathParts[1]
  }

  // No tenant found
  return null
}
