import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const posts = await convex.query(api.posts.getPublishedPosts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[PUBLIC_POSTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
