import { NextRequest, NextResponse } from "next/server";

async function fetchWooCommerce<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<{ data: T; totalPages: number; total: number }> {
  const url = new URL(`${process.env.WC_URL}/wp-json/wc/v3${endpoint}`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const credentials = Buffer.from(
    `${process.env.WC_KEY}:${process.env.WC_SECRET}`
  ).toString("base64");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WooCommerce Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const totalPages = parseInt(response.headers.get("X-WP-TotalPages") ?? "1", 10);
  const total = parseInt(response.headers.get("X-WP-Total") ?? "0", 10);

  return { data, totalPages, total };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  try {
    const q: Record<string, string> = {
      per_page: sp.get("per_page") ?? "12",
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

    const { data: rawProducts, totalPages, total } = await fetchWooCommerce<any[]>("/products", q);

    const products = rawProducts.map((p) => ({
      ...p,
      image: p.images?.[0]?.src || null,
    }));

    return NextResponse.json(
      { products, totalPages, total },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}