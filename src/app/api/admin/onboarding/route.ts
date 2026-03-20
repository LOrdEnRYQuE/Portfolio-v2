import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { completed } = await req.json();
    
    await convex.mutation(api.siteConfig.upsert, {
      key: "onboarding_completed",
      value: completed ? "true" : "false"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update onboarding status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
