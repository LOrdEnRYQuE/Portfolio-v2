import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
    emailVerified: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.string(), // "ADMIN" | "CLIENT" | "USER"
    onboardingData: v.optional(v.string()), // JSON string
  }).index("by_email", ["email"]),

  accounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
  }).index("by_provider", ["provider", "providerAccountId"]),

  sessions: defineTable({
    sessionToken: v.string(),
    userId: v.id("users"),
    expires: v.string(),
  }).index("by_token", ["sessionToken"]),

  projects: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "ACTIVE", etc.
    health: v.string(), // "STABLE", etc.
    efficiency: v.number(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  stages: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    order: v.number(),
    projectId: v.id("projects"),
  }).index("by_project", ["projectId"]),

  documents: defineTable({
    title: v.string(),
    type: v.string(),
    url: v.string(),
    size: v.optional(v.string()),
    projectId: v.id("projects"),
  }).index("by_project", ["projectId"]),

  agents: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    personality: v.optional(v.string()),
    config: v.string(), // JSON string
    userId: v.id("users"),
    status: v.string(),
    lastProcessedAt: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  agentKnowledge: defineTable({
    agentId: v.id("agents"),
    fileName: v.string(),
    type: v.string(),
    content: v.string(),
  }).index("by_agent", ["agentId"]),

  agentConversations: defineTable({
    agentId: v.id("agents"),
    visitorId: v.optional(v.string()),
  }).index("by_agent", ["agentId"]),

  agentMessages: defineTable({
    conversationId: v.id("agentConversations"),
    role: v.string(), // "user" | "assistant"
    content: v.string(),
  }).index("by_conversation", ["conversationId"]),

  leads: defineTable({
    name: v.string(),
    email: v.string(),
    concept: v.string(),
    industry: v.string(),
    description: v.optional(v.string()),
    features: v.string(), // JSON string
    timeline: v.optional(v.string()),
    stack: v.optional(v.string()),
    status: v.string(),
  }).index("by_email", ["email"]).index("by_status", ["status"]),

  siteConfig: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  assets: defineTable({
    title: v.string(),
    type: v.string(),
    ext: v.string(),
    size: v.string(),
    url: v.string(),
  }).index("by_type", ["type"]),

  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
    image: v.optional(v.string()),
    published: v.boolean(),
    tags: v.string(), // JSON string
  }).index("by_slug", ["slug"]).index("by_published", ["published"]),

  portalMessages: defineTable({
    content: v.string(),
    role: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  portfolioProjects: defineTable({
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    brief: v.optional(v.string()),
    stack: v.string(), // JSON string
    cover: v.string(),
    featured: v.boolean(),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    status: v.string(),
  }).index("by_slug", ["slug"]),

  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    published: v.boolean(),
    inNavbar: v.boolean(),
    order: v.number(),
  }).index("by_slug", ["slug"]).index("by_published", ["published"]),
});
