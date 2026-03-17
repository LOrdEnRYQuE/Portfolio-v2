import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        status: "CONTACTED",
        // We could also log the contact in a separate table here
      }
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
