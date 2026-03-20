import { NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


export async function GET() {
  try {
    const posts = await convex.query(api.posts.getPublishedPosts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[PUBLIC_POSTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
