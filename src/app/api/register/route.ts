import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    const existingUser = await convex.query(api.users.getUserByEmail, { email });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = await convex.mutation(api.users.createUser, {
      email,
      password: hashedPassword,
      name,
      role: "CLIENT"
    });

    return NextResponse.json({
      id: userId,
      email,
      name
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Registration error:", error);
    return new NextResponse(message, { status: 500 });
  }
}
