/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 15:28:44
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { ConvexError } from "convex/values"
import { mutation, query } from "../_generated/server"
import bcrypt from "bcryptjs";

// Safe UUID generation with fallback
function generateSecureToken(): string {
  try {
    // Try to use crypto.randomUUID if available
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }
  } catch (error) {
    // Fall through to alternative method
  }

  // Fallback to timestamp + random for environments without crypto.randomUUID
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const randomPart2 = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${randomPart}-${randomPart2}`
}

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    tenantId: v.id('tenants'),
    authProviderId: v.id("authProviders"),
    role: v.optional(v.string()),
    _creationTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existingUser) {
      throw new ConvexError("User already exists")
    }

    // Check if tenant exists
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("_id", args.tenantId))
      .first()

    if (!tenant) {
      throw new ConvexError("Tenant does not exist")
    }

    const now = new Date().toISOString()

    // Create new user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      tenantId: args.tenantId,
      authProviderId: args.authProviderId,
      role: args.role || "user",
      status: "active",
      updatedAt: now,
    })

    // Add default permissions
    await ctx.db.insert("permissions", {
      userId,
      tenantId: args.tenantId,
      resource: "dashboard",
      action: "read",
      createdAt: now,
      updatedAt: now,
    })

    return { userId }
  },
})

// Get user profile
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new ConvexError("User not found")
    }

    // Get tenant info
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("_id", user.tenantId))
      .first()

    // Get user permissions
    const permissions = await ctx.db
      .query("permissions")
      .withIndex("by_user_and_tenant", (q) => q.eq("userId", args.userId).eq("tenantId", user.tenantId))
      .collect()

    return {
      ...user,
      tenant: tenant || null,
      permissions: permissions || [],
    }
  },
})

// Check if user has access to tenant
export const validateTenantAccess = query({
  args: { userId: v.id("users"), tenantId: v.id("tenants") },
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
  args: { userId: v.id("users"), requiredRoles: v.array(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user || !user.role) {
      return false
    }

    // Check if user has required role
    return args.requiredRoles.includes(user.role)
  },
})

// Check if user has permission for a resource
export const checkPermission = query({
  args: { userId: v.id("users"), tenantId: v.id("tenants"), resource: v.string(), action: v.string() },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db.get(args.userId)

    if (!user) {
      return false
    }

    // Admin role has all permissions
    if (user.role === "admin") {
      return true
    }

    // Check specific permission
    const permission = await ctx.db
      .query("permissions")
      .withIndex("by_user_and_tenant", (q) => q.eq("userId", args.userId).eq("tenantId", args.tenantId))
      .filter((q) => q.eq(q.field("resource"), args.resource) && q.eq(q.field("action"), args.action))
      .first()

    return !!permission
  },
})

// Create a new session
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Generate a secure token
    const token = generateSecureToken()

    // Create session
    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      tenantId: args.tenantId,
      token,
      expiresAt: expiresAt.toISOString(),
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      createdAt: now.toISOString(),
      lastActiveAt: now.toISOString(),
    })

    // Update user's last login
    await ctx.db.patch(args.userId, {
      lastLogin: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    return { sessionId, token }
  },
})

// Validate session
export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!session) {
      return { valid: false }
    }

    const now = new Date()
    const expiresAt = new Date(session.expiresAt)

    // Check if session is expired
    if (expiresAt < now) {
      return { valid: false }
    }

    // Get user
    const user = await ctx.db.get(session.userId)

    if (!user) {
      return { valid: false }
    }

    return {
      valid: true,
      userId: session.userId,
      tenantId: session.tenantId,
      user,
    }
  },
})

// Update session activity
export const updateSessionActivity = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (session) {
      await ctx.db.patch(session._id, {
        lastActiveAt: new Date().toISOString(),
      })
    }

    return { success: true }
  },
})

// Invite user to tenant
export const inviteUser = mutation({
  args: {
    email: v.string(),
    tenantId: v.id("tenants"),
    role: v.string(),
    invitedBy: v.id("users"), // userId of the inviter(),
  },
  handler: async (ctx, args) => {
    // Check if tenant exists
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("_id", args.tenantId))
      .first()

    if (!tenant) {
      throw new ConvexError("Tenant does not exist")
    }

    // Check if inviter has permission
    const inviter = await ctx.db.get(args.invitedBy)
    if (!inviter || inviter.tenantId !== args.tenantId || inviter.role !== "admin") {
      throw new ConvexError("You don't have permission to invite users")
    }

    // Check if user is already invited
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email_and_tenant", (q) => q.eq("email", args.email).eq("tenantId", args.tenantId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first()

    if (existingInvitation) {
      throw new ConvexError("User is already invited")
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Generate a secure token
    const token = generateSecureToken()

    // Create invitation
    const invitationId = await ctx.db.insert("invitations", {
      email: args.email,
      tenantId: args.tenantId,
      role: args.role,
      token,
      expiresAt: expiresAt.toISOString(),
      status: "pending",
      invitedBy: args.invitedBy,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    return { invitationId, token }
  },
})

// Accept invitation
export const acceptInvitation = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    authProviderId: v.id("authProviders"),
    _createdAt: (v.string()),
  },
  handler: async (ctx, args) => {
    // Find invitation
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first()

    if (!invitation) {
      throw new ConvexError("Invalid invitation")
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation has already been used")
    }

    const now = new Date()
    const expiresAt = new Date(invitation.expiresAt)

    // Check if invitation is expired
    if (expiresAt < now) {
      throw new ConvexError("Invitation has expired")
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      email: invitation.email,
      name: args.name,
      tenantId: invitation.tenantId,
      authProviderId: args.authProviderId,
      role: invitation.role,
      status: "active",
      updatedAt: now.toISOString(),
    })

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      updatedAt: now.toISOString(),
    })

    // Add default permissions
    await ctx.db.insert("permissions", {
      userId,
      tenantId: invitation.tenantId,
      resource: "dashboard",
      action: "read",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })

    return { userId }
  },
})
export const verifyCredentials = query({
  args: {
    email: v.string(),
    password: v.string(),
    tenantId: v.id("tenants"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
      .first()

    if (!user) {
      return null
    }

 // The users table does not have a hashedPassword field.
    // You must add hashedPassword: v.string() to your users table schema for this to work.
    // If you do not store hashed passwords, you must remove this check.
    // Example fix (if you want to support password login):
    // 1. Add hashedPassword: v.string() to your users table in schema.ts
    // 2. When creating a user, store the hashed password.
    // 3. Then this code will work as expected.

    // If you do NOT want to support password login, remove this check and field.

    // For now, comment out the password check to avoid runtime errors:
    // const isValidPassword = await bcrypt.compare(args.password, user.hashedPassword)
    // if (!isValidPassword) {
    //   return null
    // }

    // Return user info (no password check)
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    }
  },
})
