import { NextRequest, NextResponse } from "next/server";

const WC_URL    = process.env.WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

export async function GET_WISHLIST(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer");

  const res = await fetch(
    `${WC_URL}/wp-json/ti-woocommerce-wishlist/v1/wishlists/get_products?user_id=${customerId}`,
    { headers: { Authorization: wcAuth() } }
  );

  if (!res.ok) return NextResponse.json([], { status: 200 }); // graceful empty on error
  const data = await res.json();
  // Normalize to { product_id, name, price, image }
  const items = (data?.products ?? []).map((p: any) => ({
    product_id: p.product_id,
    name: p.name,
    price: p.price,
    image: p.thumbnail,
  }));
  return NextResponse.json(items);
}

export async function DELETE_WISHLIST(req: NextRequest) {
  const { customer, product_id } = await req.json();

  const res = await fetch(
    `${WC_URL}/wp-json/ti-woocommerce-wishlist/v1/wishlists/remove_product`,
    {
      method: "DELETE",
      headers: { Authorization: wcAuth(), "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: customer, product_id }),
    }
  );

  return NextResponse.json({ ok: res.ok });
}
