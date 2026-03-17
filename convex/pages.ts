import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listNavbarPages = query({
  args: {},
  handler: async (ctx) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_published", (q) => q.eq("published", true))
      .filter((q) => q.eq(q.field("inNavbar"), true))
      .collect();
    
    return pages.sort((a, b) => (a.order || 0) - (b.order || 0));
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pages").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    published: v.boolean(),
    inNavbar: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pages", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("pages"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    published: v.optional(v.boolean()),
    inNavbar: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const upsertBySlug = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    published: v.boolean(),
    inNavbar: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        ...(args.title ? { title: args.title } : {}),
        ...(args.description ? { description: args.description } : {}),
      });
      return existing._id;
    }

    return await ctx.db.insert("pages", args);
  },
});
