import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.string(),
    tenantId: v.string(),
    authProviderId: v.string(), // ID from auth provider (Auth0, etc.)
    role: v.string(), // admin, manager, user
    status: v.string(), // active, invited, suspended
    lastLogin: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    createdAt: v.string(),
    updatedAt: v.string(),
    image: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_auth_provider", ["authProviderId"])
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_and_role", ["tenantId", "role"]),

  // Tenants table
  tenants: defineTable({
    id: v.string(),
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    plan: v.string(), // free, pro, enterprise
    features: v.array(v.string()),
    status: v.string(), // active, trial, suspended
    trialEndsAt: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    createdAt: v.string(),
    updatedAt: v.string(),
    ownerId: v.optional(v.string()),
  })
    .index("by_id", ["id"])
    .index("by_subdomain", ["subdomain"])
    .index("by_owner", ["ownerId"])
    .index("by_custom_domain", ["customDomain"]),

  // Permissions table
  permissions: defineTable({
    userId: v.string(),
    tenantId: v.string(),
    resource: v.string(), // e.g., "projects", "team", "settings"
    action: v.string(), // e.g., "read", "write", "delete"
    conditions: v.optional(v.object({})), // Additional conditions for the permission
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user_and_tenant", ["userId", "tenantId"])
    .index("by_tenant_and_resource", ["tenantId", "resource"]),

  // Sessions table
  sessions: defineTable({
    userId: v.string(),
    tenantId: v.string(),
    token: v.string(),
    expiresAt: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.string(),
    lastActiveAt: v.string(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_user_and_tenant", ["userId", "tenantId"]),

  // Invitations table
  invitations: defineTable({
    email: v.string(),
    tenantId: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.string(),
    status: v.string(), // pending, accepted, expired
    invitedBy: v.string(), // userId of the inviter
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_email_and_tenant", ["email", "tenantId"])
    .index("by_token", ["token"])
    .index("by_tenant", ["tenantId"]),
})
