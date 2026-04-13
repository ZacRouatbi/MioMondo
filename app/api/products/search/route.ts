import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/core/cache";
import { secureRequest } from "@/lib/core/gateway";

export async function GET(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "public");

    if (!gateway.ok) {
      return NextResponse.json([], { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("q") || "";
    const searchTerm = raw.trim().toLowerCase();

    if (searchTerm.length < 2) {
      return NextResponse.json([]);
    }

    const cacheKey = `search:${searchTerm}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const WC_URL = `${process.env.WC_URL}/wp-json/wc/v3`;

    const auth = Buffer.from(
      `${process.env.WC_KEY}:${process.env.WC_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${WC_URL}/products?search=${encodeURIComponent(
        searchTerm
      )}&per_page=10&status=publish`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("WooCommerce Search Failed");
    }

    const data = await response.json();

    const results = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images?.[0]?.src || null,
    }));

  
    await setCache(cacheKey, results, 120);

    return NextResponse.json(results);

  } catch (error) {
    console.error("Search API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}