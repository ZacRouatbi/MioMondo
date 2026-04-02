import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("q");

  // Don't waste API calls on empty strings
  if (!searchTerm || searchTerm.length < 2) {
    return NextResponse.json([]);
  }

  const WC_URL = `${process.env.WC_URL}/wp-json/wc/v3`;
  const WC_KEY = process.env.WC_KEY;
  const WC_SECRET = process.env.WC_SECRET;

  try {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
    
    // We fetch products matching the search string, limited to 10 for the dropdown
    const response = await fetch(
      `${WC_URL}/products?search=${encodeURIComponent(searchTerm)}&per_page=10&status=publish`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) throw new Error("WooCommerce Search Failed");

    const data = await response.json();

    // Map the data to keep it light for the frontend
    const results = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images && p.images.length > 0 ? p.images[0].src : null,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}