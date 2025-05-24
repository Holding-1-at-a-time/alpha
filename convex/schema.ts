import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    tenantId: v.string(),
    authProviderId: v.string(),
    role: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    image: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_auth_provider", ["authProviderId"])
    .index("by_tenant", ["tenantId"]),

  tenants: defineTable({
    id: v.string(),
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    features: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    ownerId: v.optional(v.string()),
  })
    .index("by_id", ["id"])
    .index("by_subdomain", ["subdomain"])
    .index("by_owner", ["ownerId"]),
})
