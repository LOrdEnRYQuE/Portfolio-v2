import { ConvexHttpClient } from "convex/browser";

/**
 * Centralized Convex HTTP Client
 * Used for server-side queries and mutations in Next.js API routes or Server Components.
 */

export const CONVEX_URL = 
  process.env.NEXT_PUBLIC_CONVEX_URL || 
  process.env.CONVEX_URL || 
  "https://jovial-ibex-866.eu-west-1.convex.cloud";

export const convex = new ConvexHttpClient(CONVEX_URL);
