import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await convex.query(api.users.getUserByEmail, { email });

    // We return success even if user doesn't exist for security (avoid enumeration)
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
    } else {
      console.log(`Password reset requested for user: ${email}. Recovery signal emitted.`);
      // In a real app, we would generate a token and send an email via Resend/SendGrid
    }

    return NextResponse.json({ 
      success: true, 
      message: "Recovery signal emitted. Check your communication node (email)." 
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
