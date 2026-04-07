import { NextRequest, NextResponse } from "next/server";
import type { WCRawProduct } from "@/types/product";

async function fetchWooCommerce<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
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

  return response.json();
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Explicitly typed as a Promise
) {
  try {
  
    const { slug } = await params; 

    const results = await fetchWooCommerce<WCRawProduct[]>("/products", {
      slug: slug, // passing the unwrapped slug
      per_page: "1",
    });

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const raw = results[0];

    const product = {
      ...raw,
      image: raw.images?.[0]?.src || null,
      images: raw.images ?? [],
    };

    return NextResponse.json(product);
  } catch (err) {
    console.error("[GET /api/products/[slug]]", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}