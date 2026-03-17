import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteConfig").collect();
  },
});

export const listByPrefix = query({
  args: { prefix: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("siteConfig")
      .filter((q) => q.gt(q.field("key"), args.prefix))
      .collect();
  },
});

export const update = mutation({
  args: { id: v.id("siteConfig"), value: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { value: args.value });
  },
});

export const upsert = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteConfig")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
      return existing._id;
    } else {
      return await ctx.db.insert("siteConfig", {
        key: args.key,
        value: args.value,
      });
    }
  },
});
