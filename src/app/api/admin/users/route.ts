import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
// Convex Migration - Ported from Prisma
import bcrypt from "bcryptjs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await convex.query(api.users.listUsers);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existingUser = await convex.query(api.users.getUserByEmail, { email });

    if (existingUser) {
      return NextResponse.json({ error: "Personnel node already exists with this identifier" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await convex.mutation(api.users.createUser, {
      name,
      email,
      password: hashedPassword,
      role: role || "CLIENT"
    });

    const user = await convex.query(api.users.getUserById, { id: userId as Id<"users"> });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create user node:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
