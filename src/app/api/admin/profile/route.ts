import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { convex } from "@/lib/convex";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import bcrypt from "bcryptjs";


export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, password, image } = body;

    const currentUser = await convex.query(api.users.getUserByEmail, {
      email: session.user.email!
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const updateData: { name?: string; email?: string; image?: string; password?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (image) updateData.image = image;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await convex.mutation(api.users.updateUser, {
      id: currentUser._id as Id<"users">,
      name: updateData.name,
      role: undefined,
      image: updateData.image,
    });

    // Re-fetch updated user
    const updatedUser = await convex.query(api.users.getUserById, { id: currentUser._id });

    // Remove password from response
    const { password: _pw, ...userWithoutPassword } = updatedUser || {};
    void _pw; // fix unused var warning

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
