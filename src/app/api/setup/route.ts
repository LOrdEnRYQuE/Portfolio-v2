import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const email = "hello@lordenryque.com";
    const password = "admin_password_2026";
    
    // Check if user already exists
    const existingUser = await convex.query(api.users.getUserByEmail, { email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await convex.mutation(api.users.createUser, {
      email,
      password: hashedPassword,
      name: "Attila Lazar",
      role: "ADMIN"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Admin user created successfully!",
      credentials: {
        email,
        password
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 500 });
  }
}
