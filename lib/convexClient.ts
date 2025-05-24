import { ConvexHttpClient } from "convex/browser"
import { getConvexAuthToken } from "@/lib/auth"
import { logger } from "@/lib/logger"

// Update the Convex client initialization with proper validation

export async function getConvexClient() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

    // Validate that we have a proper URL
    if (!convexUrl || typeof convexUrl !== "string" || !convexUrl.startsWith("https://")) {
      throw new Error("Invalid Convex URL. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.")
    }

    const token = await getConvexAuthToken()
    const client = new ConvexHttpClient(convexUrl)

    // Add auth token to headers if available
    if (token) {
      client.setAuth(token)
    }

    // Get tenant ID from cookies or localStorage
    const tenantId =
      typeof window !== "undefined"
        ? localStorage.getItem("tenantId") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("tenantId="))
            ?.split("=")[1]
        : null

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
