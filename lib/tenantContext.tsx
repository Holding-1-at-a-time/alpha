/**
 * @description      :
 * @author           : rrome
 * @group            :
 * @created          : 24/05/2025 - 17:13:28
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 24/05/2025
 * - Author          : rrome
 * - Modification    :
 **/
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

// Create context at the module level, not inside the component
const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider(props: { children: ReactNode; tenantId: string }) {
  // Use props.tenantId instead of tenantId
  // Remove reference to undefined getTenantConfig function
  const tenant: TenantMeta = {
    id: props.tenantId,
    name: props.tenantId.charAt(0).toUpperCase() + props.tenantId.slice(1),
    primaryColor: "#3b82f6", // Default to blue
    features: ["dashboard", "projects", "team"],
  }

  logger.info(`TenantProvider initialized with tenant: ${props.tenantId}`)

  // Add proper return statement
  return <TenantContext.Provider value={{ tenant }}>{props.children}</TenantContext.Provider>
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context.tenant
}

// Add the missing getTenantFromRequest function
export function getTenantFromRequest(request: NextRequest): string | null {
  const tenantFromCookie = request.cookies.get("tenantId")?.value
  if (tenantFromCookie) {
    return tenantFromCookie
  }

  const hostname = request.headers.get("host") || ""
  const parts = hostname.split(".")

  if (parts.length > 2) {
    const subdomain = parts[0]
    if (subdomain !== "www") {
      return subdomain
    }
  }

  const pathParts = request.nextUrl.pathname.split("/")
  if (pathParts.length > 1 && pathParts[1]) {
    return pathParts[1]
  }

  return null
}
