import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// GET /api/admin/pages - List all pages
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const page = await convex.query(api.pages.getBySlug, { slug: id });
      return NextResponse.json(page);
    }

    const pages = await convex.query(api.pages.listAll);
    return NextResponse.json(pages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

// POST /api/admin/pages - Create new page
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const pageId = await convex.mutation(api.pages.create, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content || "",
      published: data.published ?? false,
      inNavbar: data.inNavbar ?? false,
      order: data.order ?? 0,
    });
    return NextResponse.json({ _id: pageId, ...data });
  } catch {
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}

// PUT /api/admin/pages - Update page
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await convex.mutation(api.pages.update, {
      id: data.id as Id<"pages">,
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      published: data.published,
      inNavbar: data.inNavbar,
      order: data.order,
    });
    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

// DELETE /api/admin/pages - Delete page
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await convex.mutation(api.pages.remove, { id: id as Id<"pages"> });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
