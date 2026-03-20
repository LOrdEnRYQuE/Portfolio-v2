import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../convex/_generated/api";

// We'll wrap the default withAuth so we can add SEO Redirects
const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip assets and internal paths to optimize performance
  if (
    pathname.startsWith("/_next") || 
    pathname.includes(".") || 
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Handle Protected Routes (Admin/Client)
  if (pathname.startsWith("/admin") || pathname.startsWith("/client")) {
    return (authMiddleware as any)(req);
  }

  // 3. SEO Strategic Redirects (301/302 from legacy or keyword-rich paths)
  try {
    // Only check if it's a potential content page
    if (pathname !== "/" && !pathname.startsWith("/login")) {
      const redirects = await fetchQuery(api.redirects.listAll);
      const match = redirects.find(r => r.source === pathname || r.source === pathname.replace(/\/$/, ""));
      
      if (match) {
        return NextResponse.redirect(new URL(match.destination, req.url), {
          status: match.permanent ? 301 : 302,
        });
      }
    }
  } catch (error) {
    // Fail silently on redirect fetch to prioritize uptime
    console.warn("Redirect check failed, continuing normal flow.");
  }

  return NextResponse.next();
}

export const config = {
  // Broad matcher for the base site to catch redirects, 
  // but we'll exclude assets early in the logic.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
