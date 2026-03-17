import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { writeFile } from "fs/promises";
import { join } from "path";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets = await convex.query(api.assets.listAll);

    return NextResponse.json(assets);
  } catch (error) {
    console.error("[MEDIA_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic filename based on timestamp to avoid collisions
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const uploadPath = join(process.cwd(), "public/uploads", fileName);

    await writeFile(uploadPath, buffer);

    const type = file.type.startsWith("image/") ? "IMAGE" : 
                 file.type === "application/pdf" ? "DOCUMENT" : "DATA";

    const asset = await convex.mutation(api.assets.create, {
      title: file.name,
      type,
      ext: file.name.split(".").pop() || "unknown",
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      url: `/uploads/${fileName}`
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("[MEDIA_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
