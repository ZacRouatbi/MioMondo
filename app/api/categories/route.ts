import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { getCache, setCache } from "@/lib/core/cache";

export async function GET(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "public");

    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);

    let per_page = parseInt(
      searchParams.get("per_page") || "20",
      10
    );

    if (isNaN(per_page) || per_page < 1) per_page = 20;
    if (per_page > 50) per_page = 50;
    const cacheKey = `categories:${per_page}`;

    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const wcUrl = `${process.env.WC_URL}/wp-json/wc/v3/products/categories`;

    const auth = Buffer.from(
      `${process.env.WC_KEY}:${process.env.WC_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${wcUrl}?per_page=${per_page}&hide_empty=false`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid response from store" },
        { status: 500 }
      );
    }

    const categories = data
      .filter((cat: any) => cat.slug !== "uncategorized")
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parent: cat.parent ?? 0,
        count: cat.count ?? 0,
        image: cat.image
          ? {
              src: cat.image.src,
              alt: cat.image.alt || cat.name,
            }
          : null,
      }));

    await setCache(cacheKey, categories, 3600);

    return NextResponse.json(categories);

  } catch (error) {
    return NextResponse.json(
      { error: "Connection failed" },
      { status: 500 }
    );
  }
}