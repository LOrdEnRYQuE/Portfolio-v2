/**
 * List emails by folder (INBOX, SENT, DRAFTS, SPAM, TRASH)
 * Supports virtual "STARRED" folder
 */
export const listByFolder = query({
  args: { folder: v.string(), tag: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let emails;
    if (args.folder === "STARRED") {
      emails = await ctx.db
        .query("emails")
        .filter((q) => q.eq(q.field("isStarred"), true))
        .order("desc")
        .collect();
    } else {
      emails = await ctx.db
        .query("emails")
        .withIndex("by_folder", (q) => q.eq("folder", args.folder))
        .order("desc")
        .collect();
    }

    if (args.tag) {
      return emails.filter(e => e.tags?.includes(args.tag!));
    }
    return emails;
  },
});

/**
 * Get email detail by ID
 */
export const getById = query({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * List all emails in a thread/conversation
 */
export const listByThread = query({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emails")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("asc")
      .collect();
  },
});

/**
 * Create a new email entry (Internal use)
 */
export const create = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    folder: v.string(),
    status: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    threadId: v.optional(v.string()),
    metadata: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emails", {
      from: args.from,
      to: args.to,
      subject: args.subject,
      body: args.body,
      folder: args.folder,
      status: args.status || "UNREAD",
      sentAt: new Date().toISOString(),
      userId: args.userId,
      threadId: args.threadId || Math.random().toString(36).substring(7),
      metadata: args.metadata,
      tags: args.tags || [],
      isStarred: false,
    });
  },
});

/**
 * Toggle Star status
 */
export const toggleStar = mutation({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Email not found");
    await ctx.db.patch(args.id, { isStarred: !email.isStarred });
  },
});

/**
 * Add a tag to an email
 */
export const addTag = mutation({
  args: { id: v.id("emails"), tag: v.string() },
  handler: async (ctx, args) => {
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Email not found");
    const tags = email.tags || [];
    if (!tags.includes(args.tag)) {
      await ctx.db.patch(args.id, { tags: [...tags, args.tag] });
    }
  },
});

/**
 * Remove a tag from an email
 */
export const removeTag = mutation({
  args: { id: v.id("emails"), tag: v.string() },
  handler: async (ctx, args) => {
    const email = await ctx.db.get(args.id);
    if (!email) throw new Error("Email not found");
    const tags = email.tags || [];
    await ctx.db.patch(args.id, { tags: tags.filter(t => t !== args.tag) });
  },
});

/**
 * Mark email as READ/UNREAD
 */
export const updateStatus = mutation({
  args: { id: v.id("emails"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/**
 * Move email to a different folder
 */
export const moveFolder = mutation({
  args: { id: v.id("emails"), folder: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { folder: args.folder });
  },
});

/**
 * Permanently delete an email
 */
export const remove = mutation({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Get unread counts for all folders + starred count
 */
export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const folders = ["INBOX", "SENT", "DRAFTS", "SPAM", "TRASH"];
    const counts: Record<string, number> = {};
    
    for (const folder of folders) {
      const emailCount = await ctx.db
        .query("emails")
        .withIndex("by_folder", (q) => q.eq("folder", folder))
        .filter((q) => q.eq(q.field("status"), "UNREAD"))
        .collect();
      counts[folder] = emailCount.length;
    }

    // Starred count (total starred, not just unread)
    const starred = await ctx.db
      .query("emails")
      .filter((q) => q.eq(q.field("isStarred"), true))
      .collect();
    counts["STARRED"] = starred.length;
    
    return counts;
  },
});
