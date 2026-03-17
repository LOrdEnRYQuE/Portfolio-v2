import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.id("agentConversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;
    
    const messages = await ctx.db
      .query("agentMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.id))
      .collect();
      
    return {
      ...conversation,
      messages,
    };
  },
});

export const listByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("agentConversations")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .collect();

    const conversationsWithStats = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await ctx.db
          .query("agentMessages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();
        return {
          ...conv,
          _count: {
            messages: messages.length,
          },
        };
      })
    );

    return conversationsWithStats;
  },
});

export const getMessages = query({
  args: { conversationId: v.id("agentConversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();
  },
});

export const createMessage = mutation({
  args: {
    conversationId: v.id("agentConversations"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentMessages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
    });
  },
});
