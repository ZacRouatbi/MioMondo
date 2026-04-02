import { NextResponse } from "next/server";

export async function GET() {
  const WC_URL = `${process.env.WC_URL}/wp-json/wc/v3`;
  const WC_KEY = process.env.WC_KEY;
  const WC_SECRET = process.env.WC_SECRET;

  if (!WC_KEY || !WC_SECRET) {
    return NextResponse.json({ error: "Missing API keys" }, { status: 500 });
  }

  try {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
    
  
    const response = await fetch(
      `${WC_URL}/products?orderby=popularity&order=desc&per_page=12&status=publish`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 } // Cache on the server for 1 hour
      }
    );

    if (!response.ok) throw new Error("WooCommerce fetch failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}