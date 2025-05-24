import { ConvexClient } from "convex/browser"
import { initializeAuth } from "./auth"
import { logger } from "./logger"

// Initialize Convex client with auth token
export async function createConvexClient() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined")
    }

    const client = new ConvexClient(convexUrl)

    // Get auth token from auth provider
    const auth = await initializeAuth()
    const token = await auth.getToken()

    if (token) {
      client.setAuth(token)
    }

    return client
  } catch (error) {
    logger.error("Error creating Convex client", error as Error)
    throw error
  }
}

// Create a wrapper for Convex client that adds tenant ID to all requests
export function withTenant(client: ConvexClient, tenantId: string) {
  // This is a simplified example - in a real implementation,
  // you would need to intercept all requests and add the tenant ID header

  // For demonstration purposes only
  const originalFetch = client.fetch.bind(client)

  client.fetch = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers)
    headers.set("x-tenant-id", tenantId)

    return originalFetch(url, {
      ...options,
      headers,
    })
  }

  return client
}
