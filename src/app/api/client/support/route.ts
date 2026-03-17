import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const messages = await convex.query(api.messages.listByUser, {
      userId: session.user.id as Id<"users">
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[SUPPORT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const messageId = await convex.mutation(api.messages.create, {
      content,
      role: "user",
      userId: session.user.id as Id<"users">,
    });

    const message = { _id: messageId, content, role: "user", userId: session.user.id };

    return NextResponse.json(message);
  } catch (error) {
    console.error("[SUPPORT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
