import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";


export async function GET(_req: NextRequest) {
  try {
    const projects = await convex.query(api.portfolio.listAll);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
