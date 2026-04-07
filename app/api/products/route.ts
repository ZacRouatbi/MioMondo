import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@/types/product";

async function fetchWooCommerce<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${process.env.WC_URL}/wp-json/wc/v3${endpoint}`);
  
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const credentials = Buffer.from(
    `${process.env.WC_KEY}:${process.env.WC_SECRET}`
  ).toString("base64");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    // Adding next revalidate ensures your API stays fresh
    next: { revalidate: 60 } 
  });

  if (!response.ok) {
    throw new Error(`WooCommerce Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  try {
    const q: Record<string, string> = {
      per_page: sp.get("per_page") ?? "48", 
      page: sp.get("page") ?? "1",
      orderby: sp.get("orderby") ?? "menu_order",
      order: sp.get("order") ?? "asc",
    };

    const category = sp.get("category");
    if (category) q.category = category;

    const on_sale = sp.get("on_sale");
    if (on_sale === "true") q.on_sale = "true";

    const stock_status = sp.get("stock_status");
    if (stock_status) q.stock_status = stock_status;

    const min_price = sp.get("min_price");
    if (min_price) q.min_price = min_price;

    const max_price = sp.get("max_price");
    if (max_price) q.max_price = max_price;

    const search = sp.get("search");
    if (search) q.search = search;

    // 1. Fetch raw data
    const rawProducts = await fetchWooCommerce<any[]>("/products", q);

    // 2. Transform the data to match your ProductCard expectations
    // This extracts the image URL from the WooCommerce array and puts it at the top level
    const products = rawProducts.map((p) => ({
      ...p,
      image: p.images?.[0]?.src || null, // Your ProductCard is looking for this!
    }));

    return NextResponse.json(products);
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}