/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 15:52:19
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.string(),
    tenantId: v.id("tenants"),
    authProviderId: v.id("authProviders"), // ID from auth provider (Auth0, etc(), // ID from auth provider (Auth0, etc.)
    role: v.string(), // admin, member, user
    status: v.string(), // active, invited, suspended
    lastLogin: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    updatedAt: v.string(),
    image: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_auth_provider", ["authProviderId"])
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_and_role", ["tenantId", "role"]),

  // Tenants table
  tenants: defineTable({
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    plan: v.union(
      v.literal("basic"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    features: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("suspended")
    ),
    trialEndsAt: v.optional(v.string()),
    metadata: v.optional(v.object({})),
    createdAt: v.string(),
    updatedAt: v.string(),
    ownerId: v.optional(v.string()),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_owner", ["ownerId"])
    .index("by_custom_domain", ["customDomain"]),

  // Permissions table
  permissions: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
    resource: v.string(), // e.g., "projects", "team", "settings"
    action: v.string(), // e.g., "read", "write", "delete"
    conditions: v.optional(v.object({})), // Additional conditions for the permission
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_tenant", ["tenantId"])
    .index("by_user_and_tenant", ["userId", "tenantId"])
    .index("by_tenant_and_resource", ["tenantId", "resource"]),

  // Sessions table
  sessions: defineTable({
    userId: v.id("users"),
    tenantId: v.id("tenants"),
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
    tenantId: v.id("tenants"),
    role: v.string(),
    token: v.string(),
    expiresAt: v.string(),
    status: v.string(), // pending, accepted, expired
    invitedBy: v.id("users"), // userId of the inviter
    createdAt: v.string(),
    updatedAt: v.string(),
  })

    .index("by_email", ["email"])
    .index("by_invitedBy", ["invitedBy"])
    .index("by_email_and_tenant", ["email", "tenantId"])
    .index("by_token", ["token"])
    .index("by_tenant", ["tenantId"]),

  authProviders: defineTable({
    tenantId: v.id("tenants"),
    providerId: v.string(),
    providerName: v.string(),
    updatedAt: v.string(),
  })
  .index("by_tenant", ["tenantId"])
  .index("by_provider", ["providerId"])
  .index("by_tenant_and_provider", ["tenantId", "providerId"]),
});