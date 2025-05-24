import { logger } from "./logger"

export interface TenantConfig {
  id: string
  name: string
  subdomain: string
  customDomain?: string
  features: string[]
  limits: {
    maxUsers: number
    maxProjects: number
    maxStorage: number // in MB
  }
  branding: {
    primaryColor?: string
    logo?: string
    favicon?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Mock tenant data - in production, this would come from your database
const mockTenants: Record<string, TenantConfig> = {
  demo: {
    id: "demo",
    name: "Demo Company",
    subdomain: "demo",
    features: ["dashboard", "analytics", "projects", "team", "settings"],
    limits: {
      maxUsers: 10,
      maxProjects: 5,
      maxStorage: 1024,
    },
    branding: {
      primaryColor: "#3b82f6",
    },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  acme: {
    id: "acme",
    name: "Acme Corporation",
    subdomain: "acme",
    features: ["dashboard", "analytics", "projects", "team", "settings", "api"],
    limits: {
      maxUsers: 100,
      maxProjects: 50,
      maxStorage: 10240,
    },
    branding: {
      primaryColor: "#10b981",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
}

export async function getTenantConfig(tenantId: string): Promise<TenantConfig | null> {
  try {
    // In production, this would be a database query
    const tenant = mockTenants[tenantId]
    if (!tenant) {
      logger.warn(`Tenant not found: ${tenantId}`)
      return null
    }
    return tenant
  } catch (error) {
    logger.error(`Error fetching tenant config for ${tenantId}`, error as Error)
    return null
  }
}

export async function validateTenantAccess(tenantId: string, userId?: string): Promise<boolean> {
  try {
    // In production, check if user has access to this tenant
    const tenant = await getTenantConfig(tenantId)
    if (!tenant) {
      return false
    }

    // For now, we'll allow access if tenant exists
    // In production, check user permissions
    return true
  } catch (error) {
    logger.error(`Error validating tenant access`, error as Error)
    return false
  }
}

export function isFeatureEnabled(tenant: TenantConfig, feature: string): boolean {
  return tenant.features.includes(feature)
}

export function getTenantUrl(subdomain: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // In development, use path-based routing
  if (process.env.NODE_ENV === "development") {
    return `${baseUrl}/${subdomain}`
  }

  // In production, use subdomain
  const url = new URL(baseUrl)
  return `${url.protocol}//${subdomain}.${url.host}`
}

export function extractTenantFromHost(host: string): string | null {
  // Remove port if present
  const hostname = host.split(":")[0]

  // Split by dots
  const parts = hostname.split(".")

  // In development (localhost), return null
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return null
  }

  // Check if we have a subdomain
  if (parts.length > 2) {
    const subdomain = parts[0]
    // Ignore 'www' as a tenant
    if (subdomain !== "www") {
      return subdomain
    }
  }

  return null
}
