import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUserAndId = query({
  args: { id: v.id("agents"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.id);
    if (agent && agent.userId === args.userId) {
      return agent;
    }
    return null;
  },
});

export const listAll = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const listWithStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const agents = await ctx.db
      .query("agents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const conversations = await ctx.db
          .query("agentConversations")
          .withIndex("by_agent", (q) => q.eq("agentId", agent._id))
          .collect();
        return {
          ...agent,
          _count: {
            conversations: conversations.length,
          },
        };
      })
    );

    return agentsWithStats;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    personality: v.optional(v.string()),
    config: v.string(),
    userId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    personality: v.optional(v.string()),
    config: v.optional(v.string()),
    status: v.optional(v.string()),
    lastProcessedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
