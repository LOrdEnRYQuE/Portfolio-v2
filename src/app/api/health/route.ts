import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    // Check database connection by running a simple query
    await convex.query(api.pages.listNavbarPages);
    
    return NextResponse.json({
      status: "UP",
      timestamp: new Date().toISOString(),
      database: "CONNECTED",
      uptime: process.uptime()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({
      status: "DOWN",
      timestamp: new Date().toISOString(),
      database: "DISCONNECTED",
      error: error instanceof Error ? error.message : "Internal Server Error"
    }, { status: 503 });
  }
}
