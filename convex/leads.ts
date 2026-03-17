import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    concept: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.string()),
    timeline: v.optional(v.string()),
    stack: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      name: args.name,
      email: args.email,
      concept: args.concept || "Standard Inquiry",
      industry: args.industry || "Startup",
      description: args.description,
      features: args.features || "[]",
      timeline: args.timeline,
      stack: args.stack,
      status: "NEW",
    });
    return leadId;
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    status: v.optional(v.string()),
    concept: v.optional(v.string()),
    industry: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.string()),
    timeline: v.optional(v.string()),
    stack: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
