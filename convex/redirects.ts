import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("redirects").collect();
  },
});

export const getBySource = query({
  args: { source: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("redirects")
      .withIndex("by_source", (q) => q.eq("source", args.source))
      .first();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("redirects")),
    source: v.string(),
    destination: v.string(),
    permanent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    if (id) {
      await ctx.db.patch(id, rest);
      return id;
    }
    return await ctx.db.insert("redirects", rest);
  },
});

export const remove = mutation({
  args: { id: v.id("redirects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
