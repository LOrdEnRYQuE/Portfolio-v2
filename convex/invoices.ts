import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").order("desc").collect();
    return Promise.all(
      invoices.map(async (invoice) => {
        const user = await ctx.db.get(invoice.userId);
        return {
          ...invoice,
          user: user ? { name: user.name, email: user.email } : null,
        };
      })
    );
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.id);
    if (!invoice) return null;
    const user = await ctx.db.get(invoice.userId);
    return { ...invoice, user };
  },
});

export const create = mutation({
  args: {
    number: v.string(),
    projectName: v.optional(v.string()),
    amount: v.number(),
    currency: v.optional(v.string()),
    status: v.optional(v.string()),
    dueDate: v.string(),
    description: v.optional(v.string()),
    details: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", {
      number: args.number,
      projectName: args.projectName,
      amount: args.amount,
      currency: args.currency || "EUR",
      status: args.status || "DRAFT",
      dueDate: args.dueDate,
      description: args.description,
      details: args.details,
      userId: args.userId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("invoices"),
    number: v.optional(v.string()),
    projectName: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    status: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    description: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
