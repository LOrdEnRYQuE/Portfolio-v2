import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const email = 'hello@lordenryque.com';
    const password = 'admin_password_2026';
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await convex.mutation(api.users.upsertUser, {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'System Admin'
    });

    const user = await convex.query(api.users.getUserById, { id: userId as Id<"users"> });

    // Self-test hash
    const isTestMatch = await bcrypt.compare(password, user?.password || "");

    return NextResponse.json({
      message: "Admin user provisioned successfully",
      email: user?.email,
      role: user?.role,
      diagnostics: {
        hashValid: !!user?.password,
        testMatch: isTestMatch,
        userId: userId
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Provisioning error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
