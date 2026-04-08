import { NextRequest, NextResponse } from "next/server";

const WC_URL    = process.env.WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customer");
  const page = searchParams.get("page") || "1";

  if (!customerId) return NextResponse.json({ error: "Missing customer" }, { status: 400 });

  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?customer=${customerId}&per_page=8&page=${page}&orderby=date&order=desc`,
    { 
      headers: { Authorization: wcAuth() },
      cache: 'no-store'
    }
  );

  if (!res.ok) return NextResponse.json({ error: "WC error" }, { status: res.status });

  const orders = await res.json();
  const totalPages = res.headers.get("X-WP-TotalPages");

  return NextResponse.json({ orders, totalPages: parseInt(totalPages || "1") });
}