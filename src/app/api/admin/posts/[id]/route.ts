import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;

  try {
    const post = await convex.query(api.posts.getById, { id: id as Id<"posts"> });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_POST_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, image, published, tags } = body;

    const post = await convex.mutation(api.posts.update, {
      id: id as Id<"posts">,
      title,
      slug,
      excerpt,
      content,
      image,
      published,
      tags: tags ? JSON.stringify(tags) : undefined,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("[ADMIN_POST_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;

  try {
    await convex.mutation(api.posts.remove, { id: id as Id<"posts"> });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_POST_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
