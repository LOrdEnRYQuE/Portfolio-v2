import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    await convex.mutation(api.users.updateUser, {
      id: id as Id<"users">,
      role
    });

    const user = await convex.query(api.users.getUserById, { id: id as Id<"users"> });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user authorization:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Prevent self-deletion
    if (id === session.user.id) {
       return NextResponse.json({ error: "Self-deauthorization prohibited" }, { status: 400 });
    }

    await convex.mutation(api.users.remove, {
      id: id as Id<"users">
    });

    return NextResponse.json({ success: true, message: "Personnel node purged from fleet" });
  } catch (error) {
    console.error("Failed to deauthorize user node:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
