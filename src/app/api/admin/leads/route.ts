// Forced re-evaluation of auth import
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await convex.query(api.leads.listAll);
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Failed to fetch leads from Convex:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
