import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { unlink } from "fs/promises";
import { join } from "path";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assetId } = await params;
    
    const asset = await convex.query(api.assets.getById, { 
      id: assetId as Id<"assets"> 
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Attempt to delete physical file
    try {
      const filePath = join(process.cwd(), "public", asset.url);
      await unlink(filePath);
    } catch (e) {
      console.warn(`Could not delete physical file: ${asset.url}`, e);
    }

    await convex.mutation(api.assets.remove, { 
      id: assetId as Id<"assets"> 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ASSET_DELETE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
