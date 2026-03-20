import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listAll = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "UNREAD"))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return unread.length;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.string(),
    userId: v.id("users"),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      status: "UNREAD",
    });
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "READ" });
  },
});

export const markAllAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_status", (q) => q.eq("status", "UNREAD"))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    for (const n of unread) {
      await ctx.db.patch(n._id, { status: "READ" });
    }
  },
});
