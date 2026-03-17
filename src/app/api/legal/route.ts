import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const configs = await convex.query(api.siteConfig.listAll);
    
    // Filter by prefix 'legal_' and convert array to object
    const legalContent = configs
      .filter(c => c.key.startsWith("legal_"))
      .reduce((acc: Record<string, string>, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
    
    return NextResponse.json(legalContent);
  } catch (error) {
    console.error("Failed to fetch legal settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
