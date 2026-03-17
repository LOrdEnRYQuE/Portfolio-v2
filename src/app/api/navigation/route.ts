import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/navigation - Public endpoint for navigation links
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pages = await (prisma as any).page.findMany({
      where: {
        published: true,
        inNavbar: true,
      },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    });

    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch navigation" }, { status: 500 });
  }
}
