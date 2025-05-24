import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    tenantId: v.string(),
    authProviderId: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existingUser) {
      throw new Error("User already exists")
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      tenantId: args.tenantId,
      authProviderId: args.authProviderId,
      role: args.role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { userId }
  },
})

// Get user profile
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Get tenant info
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("id", user.tenantId))
      .first()

    return {
      ...user,
      tenant: tenant || null,
    }
  },
})

// Check if user has access to tenant
export const validateTenantAccess = query({
  args: { userId: v.string(), tenantId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      return false
    }

    // Check if user belongs to tenant
    return user.tenantId === args.tenantId
  },
})

// Check if user has required role
export const validateUserRole = query({
  args: { userId: v.string(), requiredRoles: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user || !user.role) {
      return false
    }

    // Check if user has required role
    return args.requiredRoles.includes(user.role)
  },
})
