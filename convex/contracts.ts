import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const contracts = await ctx.db.query("contracts").order("desc").collect();
    return Promise.all(
      contracts.map(async (contract) => {
        const client = contract.clientId ? await ctx.db.get(contract.clientId) : null;
        return {
          ...contract,
          client: client ? { name: client.name, email: client.email } : null,
        };
      })
    );
  },
});

export const listByClient = query({
  args: { clientId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contracts")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (!contract) return null;
    const client = contract.clientId ? await ctx.db.get(contract.clientId) : null;
    return {
      ...contract,
      client: client ? { name: client.name, email: client.email } : null,
    };
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_token", (q) => q.eq("accessToken", args.token))
      .first();
    if (!contract) return null;
    return contract;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    language: v.string(),
    content: v.string(),
    clientId: v.optional(v.id("users")),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contracts", {
      title: args.title,
      language: args.language,
      content: args.content,
      status: "DRAFT",
      clientId: args.clientId,
      clientName: args.clientName,
      clientEmail: args.clientEmail,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contracts"),
    title: v.optional(v.string()),
    language: v.optional(v.string()),
    content: v.optional(v.string()),
    clientId: v.optional(v.id("users")),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const send = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await ctx.db.patch(args.id, {
      status: "SENT",
      sentAt: new Date().toISOString(),
      accessToken: token,
    });
    return token;
  },
});

export const markViewed = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.id);
    if (contract && contract.status === "SENT") {
      await ctx.db.patch(args.id, { status: "VIEWED" });
    }
  },
});

export const sign = mutation({
  args: {
    id: v.id("contracts"),
    signatureData: v.string(),
    clientName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, string> = {
      status: "SIGNED",
      signatureData: args.signatureData,
      signedAt: new Date().toISOString(),
    };
    if (args.clientName) {
      updates.clientName = args.clientName;
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
