import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
    image: v.optional(v.string()),
    published: v.optional(v.boolean()),
    tags: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    isIndexed: v.optional(v.boolean()),
    schemaType: v.optional(v.string()),
    faqItems: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { published, tags, ...rest } = args;
    return await ctx.db.insert("posts", {
      ...rest,
      published: published ?? false,
      tags: tags ?? "[]",
    });
  },
});

export const getById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    published: v.optional(v.boolean()),
    tags: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    isIndexed: v.optional(v.boolean()),
    schemaType: v.optional(v.string()),
    faqItems: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
