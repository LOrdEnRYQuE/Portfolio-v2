/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agentKnowledge from "../agentKnowledge.js";
import type * as agents from "../agents.js";
import type * as assets from "../assets.js";
import type * as contracts from "../contracts.js";
import type * as conversations from "../conversations.js";
import type * as dashboardStats from "../dashboardStats.js";
import type * as emails from "../emails.js";
import type * as internalProjects from "../internalProjects.js";
import type * as invoices from "../invoices.js";
import type * as leads from "../leads.js";
import type * as messages from "../messages.js";
import type * as pages from "../pages.js";
import type * as portfolio from "../portfolio.js";
import type * as posts from "../posts.js";
import type * as siteConfig from "../siteConfig.js";
import type * as tickets from "../tickets.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agentKnowledge: typeof agentKnowledge;
  agents: typeof agents;
  assets: typeof assets;
  contracts: typeof contracts;
  conversations: typeof conversations;
  dashboardStats: typeof dashboardStats;
  emails: typeof emails;
  internalProjects: typeof internalProjects;
  invoices: typeof invoices;
  leads: typeof leads;
  messages: typeof messages;
  pages: typeof pages;
  portfolio: typeof portfolio;
  posts: typeof posts;
  siteConfig: typeof siteConfig;
  tickets: typeof tickets;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
