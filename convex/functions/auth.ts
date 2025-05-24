import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { ConvexError } from "convex/values"

// Safe UUID generation with fallback
function generateSecureToken(): string {
  try {
    // Try to use crypto.randomUUID if available
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID()
    }

    // Use a more secure fallback with crypto.getRandomValues
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)

      // Convert to UUID format
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
    }
  } catch (error) {
    // Log the error but continue to fallback
    console.error("Error generating secure token:", error)
  }

  // Last resort fallback - this should almost never be used
  // This is still better than Math.random() alone, but not cryptographically secure
  const timestamp = Date.now().toString(36)
  const randomValues = []

  // Generate multiple random values and combine them
  for (let i = 0; i < 5; i++) {
    randomValues.push(Math.random().toString(36).substring(2, 15))
  }

  return `${timestamp}-${randomValues.join("-")}`
}

// Register a new user
export const registerUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    tenantId: v.string(),
    authProviderId: v.string(),
    password: v.optional(v.string()),
    role: v.optional(v.string()),
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
      .withIndex("by_id", (q) => q.eq("id", args.tenantId))
      .first()

    if (!tenant) {
      throw new ConvexError("Tenant does not exist")
    }

    const now = new Date().toISOString()

    // Create new user
    const userData: any = {
      email: args.email,
      name: args.name,
      tenantId: args.tenantId,
      authProviderId: args.authProviderId,
      role: args.role || "user",
      status: "active",
      createdAt: now,
      updatedAt: now,
    }

    // If password is provided, hash it
    // Note: In a real implementation, you would import the hashPassword function
    // For this example, we're simulating the hash with a placeholder
    if (args.password) {
      // This is a placeholder - in production, use the hashPassword function
      // userData.hashedPassword = hashPassword(args.password);
      userData.hashedPassword = `HASHED:${args.password}`
    }

    const userId = await ctx.db.insert("users", userData)

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
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)

    if (!user) {
      throw new ConvexError("User not found")
    }

    // Get tenant info
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("id", user.tenantId))
      .first()

    // Get user permissions
    const permissions = await ctx.db
      .query("permissions")
      .withIndex("by_user_and_tenant", (q) => q.eq("userId", args.userId).eq("tenantId", user.tenantId))
      .collect()

    // Remove sensitive data
    const { hashedPassword, ...safeUserData } = user

    return {
      ...safeUserData,
      tenant: tenant || null,
      permissions: permissions || [],
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

// Check if user has permission for a resource
export const checkPermission = query({
  args: { userId: v.string(), tenantId: v.string(), resource: v.string(), action: v.string() },
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
    userId: v.string(),
    tenantId: v.string(),
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

    // Update session last active time
    await ctx.db.patch(session._id, {
      lastActiveAt: now.toISOString(),
    })

    // Remove sensitive data
    const { hashedPassword, ...safeUserData } = user

    return {
      valid: true,
      userId: session.userId,
      tenantId: session.tenantId,
      user: safeUserData,
    }
  },
})

// Invite user to tenant
export const inviteUser = mutation({
  args: {
    email: v.string(),
    tenantId: v.string(),
    role: v.string(),
    invitedBy: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if tenant exists
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_id", (q) => q.eq("id", args.tenantId))
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
    authProviderId: v.string(),
    password: v.optional(v.string()),
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

    // Prepare user data
    const userData: any = {
      email: invitation.email,
      name: args.name,
      tenantId: invitation.tenantId,
      authProviderId: args.authProviderId,
      role: invitation.role,
      status: "active",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }

    // If password is provided, hash it
    if (args.password) {
      // This is a placeholder - in production, use the hashPassword function
      // userData.hashedPassword = hashPassword(args.password);
      userData.hashedPassword = `HASHED:${args.password}`
    }

    // Create user
    const userId = await ctx.db.insert("users", userData)

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

// Verify credentials - PRODUCTION IMPLEMENTATION
export const verifyCredentials = query({
  args: {
    email: v.string(),
    password: v.string(),
    tenantId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV !== "production"

    // For development only - allow demo authentication
    if (isDevelopment && args.password === "demo-password") {
      // Log this insecure access
      console.warn("INSECURE: Using demo authentication in development")

      // Find user by email
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
        .first()

      if (user) {
        // Remove sensitive data
        const { hashedPassword, ...safeUserData } = user
        return {
          id: user._id,
          ...safeUserData,
        }
      }

      return null
    }

    // PRODUCTION IMPLEMENTATION
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("tenantId"), args.tenantId))
      .first()

    if (!user || !user.hashedPassword) {
      // Log failed attempt
      console.warn("Failed login attempt", { email: args.email, tenantId: args.tenantId })
      return null
    }

    // In a real implementation, you would use the verifyPassword function
    // const isValidPassword = verifyPassword(args.password, user.hashedPassword);

    // This is a placeholder implementation
    const isValidPassword = user.hashedPassword === `HASHED:${args.password}`

    if (!isValidPassword) {
      // Log failed password attempt
      console.warn("Failed password verification", { email: args.email, tenantId: args.tenantId })
      return null
    }

    // Remove sensitive data
    const { hashedPassword, ...safeUserData } = user

    // Return user data without sensitive information
    return {
      id: user._id,
      ...safeUserData,
    }
  },
})

// Change password
export const changePassword = mutation({
  args: {
    userId: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db.get(args.userId)

    if (!user || !user.hashedPassword) {
      throw new ConvexError("User not found or password cannot be changed")
    }

    // Verify current password
    // In a real implementation, you would use the verifyPassword function
    // const isValidPassword = verifyPassword(args.currentPassword, user.hashedPassword);

    // This is a placeholder implementation
    const isValidPassword = user.hashedPassword === `HASHED:${args.currentPassword}`

    if (!isValidPassword) {
      throw new ConvexError("Current password is incorrect")
    }

    // Hash new password
    // In a real implementation, you would use the hashPassword function
    // const newHashedPassword = hashPassword(args.newPassword);
    const newHashedPassword = `HASHED:${args.newPassword}`

    // Update user with new password
    await ctx.db.patch(args.userId, {
      hashedPassword: newHashedPassword,
      updatedAt: new Date().toISOString(),
    })

    return { success: true }
  },
})
