import { ConvexHttpClient } from "convex/browser"
import { getConvexAuthToken } from "@/lib/auth"
import { logger } from "@/lib/logger"

// Initialize Convex client with auth
export async function getConvexClient() {
  try {
    const token = await getConvexAuthToken()
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "")

    // Add auth token to headers if available
    if (token) {
      client.setAuth(token)
    }

    // Get tenant ID from cookies or localStorage
    const tenantId =
      localStorage.getItem("tenantId") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("tenantId="))
        ?.split("=")[1]

    // Add tenant ID to headers if available
    if (tenantId) {
      client.setHeaders({
        "x-tenant-id": tenantId,
      })
    }

    return client
  } catch (error) {
    logger.error("Failed to initialize Convex client", error as Error)
    throw error
  }
}
