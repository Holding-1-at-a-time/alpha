/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 16:22:29
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { logger } from "@/lib/logger"
import type { Id } from "@/convex/_generated/dataModel";


// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
const convexClient =
  typeof convexUrl === "string" && convexUrl.startsWith("https://") ? new ConvexHttpClient(convexUrl) : null

// Email validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}



// Validate session token
export async function validateSession(token: string): Promise<{
  valid: boolean
  userId?: string
  tenantId?: string
  user?: any
}> {
  try {
    if (!convexClient) {
      logger.error("Convex client is not initialized")
      return { valid: false }
    }

    // Call Convex query to validate session
    return await convexClient.query(api.functions.auth.validateSession, { token });
  } catch (error) {
    logger.error("Failed to validate session", error as Error)
    return { valid: false }
  }
}

// Register a new user in Convex
export async function registerUser(userData: {
  email: string
  name: string
  tenantId: Id<"tenants">
  authProviderId: Id<"authProviders">
  role?: string
}) {
  try {
    if (!convexClient) {
      throw new Error(
        "Convex client is not initialized. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.",
      )
    }

    // Call Convex mutation to create user
    return await convexClient.mutation(api.functions.auth.registerUser, userData);

  } catch (error) {
    logger.error("Failed to register user", error as Error)
    throw error
  }
}

// Get user profile from Convex
export async function getUserProfile(userId: Id<"users">) {
  try {
    if (!convexClient) {
      throw new Error(
        "Convex client is not initialized. Please check your NEXT_PUBLIC_CONVEX_URL environment variable.",
      )
    }

    // Call Convex query to get user profile
    return await convexClient.query(api.functions.auth.getUserProfile, { userId });

  } catch (error) {
    logger.error("Failed to get user profile", error as Error)
    throw error
  }
}

export { validateUserRole } from "@/convex/functions/auth";
export { validateTenantAccess } from "@/convex/functions/auth";
export { checkPermission } from "@/convex/functions/auth";
export { verifyCredentials } from "@/convex/functions/auth";
export { inviteUser } from "@/convex/functions/auth";