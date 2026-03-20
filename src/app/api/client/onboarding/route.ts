import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await convex.query(api.users.getUserById, { id: session.user.id as Id<"users"> });

    return NextResponse.json(JSON.parse(user?.onboardingData || "{}"));
  } catch (error) {
    console.error("[ONBOARDING_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.json();

    await convex.mutation(api.users.updateOnboardingData, {
      id: session.user.id as Id<"users">,
      onboardingData: JSON.stringify(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ONBOARDING_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
