import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("services")),
    slug: v.string(),
    title: v.string(),
    h1: v.optional(v.string()),
    intro: v.optional(v.string()),
    content: v.string(),
    coverImage: v.optional(v.string()),
    imageAlt: v.optional(v.string()),
    published: v.boolean(),
    relatedProjects: v.optional(v.array(v.id("portfolioProjects"))),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    isIndexed: v.optional(v.boolean()),
    schemaType: v.optional(v.string()),
    faqItems: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    if (id) {
      await ctx.db.patch(id, rest);
      return id;
    }
    return await ctx.db.insert("services", rest);
  },
});

export const remove = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
