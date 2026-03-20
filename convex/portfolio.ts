import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("portfolioProjects").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("portfolioProjects")
      .filter((q) => q.eq(q.field("featured"), true))
      .order("desc")
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolioProjects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    summary: v.string(),
    description: v.string(),
    status: v.string(),
    stack: v.string(),
    cover: v.string(),
    featured: v.boolean(),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    brief: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    isIndexed: v.optional(v.boolean()),
    schemaType: v.optional(v.string()),
    faqItems: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("portfolioProjects", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("portfolioProjects"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    stack: v.optional(v.string()),
    cover: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    challenge: v.optional(v.string()),
    solution: v.optional(v.string()),
    brief: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    isIndexed: v.optional(v.boolean()),
    schemaType: v.optional(v.string()),
    faqItems: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("portfolioProjects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
