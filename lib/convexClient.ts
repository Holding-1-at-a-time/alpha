import { ConvexHttpClient } from "convex/browser"
import { auth } from "@/app/auth"
import { logger } from "@/lib/logger"

// Initialize Convex client with auth
export async function getConvexClient() {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

    // Validate that we have a proper URL
    if (!convexUrl || typeof convexUrl !== "string" || !convexUrl.startsWith("https://")) {
      throw new Error("Invalid Convex URL. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.")
    }

    const client = new ConvexHttpClient(convexUrl)

    // In browser context, get session from Auth.js
    if (typeof window !== "undefined") {
      // This would be handled by the ConvexReactClient in the AuthProvider
      // We don't need to do anything here for client-side
      return client
    }

    // In server context, get session from Auth.js
    const session = await auth()

    if (session?.user) {
      // Add tenant ID to headers
      client.setHeaders({
        "x-tenant-id": session.user.tenantId,
        "x-user-id": session.user.id,
      })
    }

    return client
  } catch (error) {
    logger.error("Failed to initialize Convex client", error as Error)
    throw error
  }
}
