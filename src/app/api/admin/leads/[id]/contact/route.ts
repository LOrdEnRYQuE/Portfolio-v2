import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { note } = await req.json();

    console.log(`Contact initialization protocol for lead ${id}. Insight digest: ${note}`);
    // For now, we update the status and record the update in a simulated way 
    // or add it to a notes field if it existed.
    // We'll update the status to CONTACTED if it's currently NEW.

    const lead = await convex.mutation(api.leads.update, {
      id: id as Id<"leads">,
      status: "CONTACTED"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Synchronization attempt recorded",
      lead 
    });
  } catch (error) {
    console.error("Failed to log contact synchronization:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
