import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("assets").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    ext: v.string(),
    size: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const assetId = await ctx.db.insert("assets", {
      ...args,
    });
    return await ctx.db.get(assetId);
  },
});

export const remove = mutation({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getById = query({
  args: { id: v.id("assets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
