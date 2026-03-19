import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const tickets = await ctx.db.query("tickets").order("desc").collect();
    return Promise.all(
      tickets.map(async (ticket) => {
        const user = await ctx.db.get(ticket.userId);
        return {
          ...ticket,
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
      .query("tickets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.id);
    if (!ticket) return null;

    const user = await ctx.db.get(ticket.userId);
    const replies = await ctx.db
      .query("ticketReplies")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.id))
      .collect();

    return {
      ...ticket,
      user: user ? { name: user.name, email: user.email } : null,
      replies,
    };
  },
});

export const create = mutation({
  args: {
    subject: v.string(),
    message: v.string(),
    priority: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tickets", {
      subject: args.subject,
      message: args.message,
      status: "OPEN",
      priority: args.priority || "MEDIUM",
      userId: args.userId,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tickets"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const addReply = mutation({
  args: {
    ticketId: v.id("tickets"),
    content: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ticketReplies", {
      ticketId: args.ticketId,
      content: args.content,
      role: args.role,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tickets") },
  handler: async (ctx, args) => {
    const replies = await ctx.db
      .query("ticketReplies")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.id))
      .collect();
    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }
    await ctx.db.delete(args.id);
  },
});
