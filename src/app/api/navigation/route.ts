import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


// GET /api/navigation - Public endpoint for navigation links
export async function GET() {
  try {
    const pages = await convex.query(api.pages.listNavbarPages);
    
    const formattedPages = pages.map(page => ({
      slug: page.slug,
      title: page.title
    }));

    return NextResponse.json(formattedPages);
  } catch (error) {
    console.error("[NAVIGATION_GET]", error);
    return NextResponse.json({ error: "Failed to fetch navigation" }, { status: 500 });
  }
}
