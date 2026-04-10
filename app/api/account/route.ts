import { NextRequest, NextResponse } from "next/server";

const WC_URL    = process.env.WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get("customer");
  if (!customerId) return NextResponse.json({ error: "Missing customer" }, { status: 400 });

  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/orders?customer=${customerId}&per_page=20&orderby=date&order=desc`,
    { headers: { Authorization: wcAuth() }, next: { revalidate: 60 } }
  );

  if (!res.ok) return NextResponse.json({ error: "WC error" }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
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

export async function GET_PAYMENT(req: NextRequest) {
  // Get customer id from session — do NOT accept it from query string
  // Replace this with your actual session extraction (NextAuth, Iron Session, etc.)
  const customerId = getCustomerIdFromSession(req);
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(
    `${WC_URL}/wp-json/wc/v3/payment_tokens?customer_id=${customerId}`,
    { headers: { Authorization: wcAuth() } }
  );

  if (!res.ok) return NextResponse.json([], { status: 200 });
  const tokens = await res.json();

  // Strip everything except safe display data — never expose token_key or gateway secrets
  const safe = tokens.map((t: any) => ({
    token_id: t.id,
    card_type: t.card_type?.toLowerCase() ?? "card",
    last4: t.last4,
    expiry_month: t.expiry_month,
    expiry_year: t.expiry_year,
  }));

  return NextResponse.json(safe);
}

export async function DELETE_PAYMENT(req: NextRequest) {
  const customerId = getCustomerIdFromSession(req);
  if (!customerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token_id } = await req.json();

  // Verify this token belongs to this customer before deleting
  const checkRes = await fetch(`${WC_URL}/wp-json/wc/v3/payment_tokens/${token_id}`, {
    headers: { Authorization: wcAuth() },
  });
  if (!checkRes.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const token = await checkRes.json();
  if (String(token.customer_id) !== String(customerId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = await fetch(`${WC_URL}/wp-json/wc/v3/payment_tokens/${token_id}`, {
    method: "DELETE",
    headers: { Authorization: wcAuth() },
  });

  return NextResponse.json({ ok: res.ok });
}

function getCustomerIdFromSession(req: NextRequest): string | null {
  // Example with NextAuth:
  // const session = await getServerSession(authOptions);
  // return session?.user?.woo_customer_id ?? null;

  // Example with Iron Session:
  // const session = await getIronSession(req, ...);
  // return session.customerId ?? null;

  return null; // TODO: implement
}