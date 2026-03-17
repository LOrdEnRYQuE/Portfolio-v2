import { NextResponse } from "next/server";

// This route is deprecated — Convex manages schema automatically.
// Kept for backwards compatibility but returns a no-op success.
export async function GET() {
  return NextResponse.json({ 
    message: "Database schema is managed by Convex. No patching needed.",
    tablesCreated: []
  });
}
