import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/core/cache";
import { secureRequest } from "@/lib/core/gateway";
import { WCRawProduct } from "@/types/product";

export async function GET(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "public");

    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const cacheKey = "products:bestsellers";
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const WC_URL = `${process.env.WC_URL}/wp-json/wc/v3`;

    const WC_KEY = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;

    if (!WC_KEY || !WC_SECRET) {
      return NextResponse.json(
        { error: "Missing API keys" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(
      `${WC_KEY}:${WC_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${WC_URL}/products?orderby=popularity&order=desc&per_page=12&status=publish`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },

        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("WooCommerce fetch failed");
    }

    const data: WCRawProduct[] =
      await response.json();

    // 📦 MAP RESPONSE
    const products = data.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      regular_price: p.regular_price,
      sale_price: p.sale_price,
      price_html: p.price_html,
      on_sale: p.on_sale,
      featured: p.featured,
      short_description: p.short_description,
      stock_status: p.stock_status,
      image: p.images?.[0]?.src ?? null,
      categories: p.categories ?? [],
    }));
    await setCache(cacheKey, products, 3600);
    return NextResponse.json(products);

  } catch (error) {
    console.error("[GET /api/bestsellers]", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}