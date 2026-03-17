import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    password: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      image: args.image,
      role: args.role || "USER",
    });
    return userId;
  },
});

export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name ?? existing.name,
        password: args.password ?? existing.password,
        role: args.role ?? existing.role,
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      password: args.password,
      role: args.role || "USER",
    });
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
export const updateOnboardingData = mutation({
  args: {
    id: v.id("users"),
    onboardingData: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { onboardingData: args.onboardingData });
  },
});
