import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByAgent = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentKnowledge")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .collect();
  },
});

export const create = mutation({
  args: {
    agentId: v.id("agents"),
    fileName: v.string(),
    type: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("agentKnowledge", {
      agentId: args.agentId,
      fileName: args.fileName,
      type: args.type,
      content: args.content,
    });

    await ctx.db.patch(args.agentId, {
      lastProcessedAt: new Date().toISOString(),
    });

    return await ctx.db.get(docId);
  },
});

export const remove = mutation({
  args: { id: v.id("agentKnowledge"), agentId: v.id("agents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc || doc.agentId !== args.agentId) {
      throw new Error("Document not found or access denied");
    }
    await ctx.db.delete(args.id);
  },
});
