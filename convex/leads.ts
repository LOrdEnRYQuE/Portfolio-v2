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

export const convertToClient = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    // 1. Check if user already exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", lead.email))
      .unique();

    // 2. Create user if doesn't exist
    if (!user) {
      const userId = await ctx.db.insert("users", {
        name: lead.name,
        email: lead.email,
        role: "CLIENT",
      });
      user = await ctx.db.get(userId);
    } else if (user.role !== "ADMIN" && user.role !== "CLIENT") {
      // Upgrade role if necessary
      await ctx.db.patch(user._id, { role: "CLIENT" });
    }

    // 3. Mark lead as converted
    await ctx.db.patch(args.id, { status: "CONVERTED" });

    return user!._id;
  },
});
export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
