import { NextRequest, NextResponse } from "next/server";

// ─── WooCommerce client ───────────────────────────────────────────────────────

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

async function wcFetch(path: string, options: RequestInit = {}) {
  const url = `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Basic ${wcAuth}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WooCommerce ${res.status}: ${text}`);
  }

  return res.json();
}

// Raw WooCommerce product shape — NOT your Product type.
// WC returns images as an array; never as a flat `image` field.
type WCRawProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  featured: boolean;
  short_description: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: { id: number; src: string; alt: string }[]; // ← array, not flat
  categories: { id: number; name: string; slug: string }[];
};

// ─── Shared mapper: WC raw → your Product shape ───────────────────────────────
function mapProduct(p: WCRawProduct) {
  return {
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
    image: p.images?.[0]?.src ?? null, // ← flatten here, once, for everyone
    categories: p.categories ?? [],
  };
}



export async function GET(request: NextRequest) {
  try {
    const ids = request.nextUrl.searchParams.get("ids");
    if (!ids) return NextResponse.json({ products: [] });

    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
    const includeParam = idList.map((id) => `include[]=${id}`).join("&");

    const raw: WCRawProduct[] = await wcFetch(
      `/products?${includeParam}&per_page=${idList.length}`
    );

    return NextResponse.json({ products: raw.map(mapProduct) });
  } catch (err) {
    console.error("[GET /api/cart]", err);
    return NextResponse.json(
      { error: "Failed to validate cart items." },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer } = body as {
      items: Array<{ id: number; variationId?: number; quantity: number }>;
      customer: {
        email: string;
        firstName: string;
        lastName: string;
        address?: string;
        city?: string;
        phone?: string;
      };
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const order = await wcFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        status: "pending",
        currency: "TND",
        line_items: items.map((i) => ({
          product_id: i.id,
          ...(i.variationId ? { variation_id: i.variationId } : {}),
          quantity: i.quantity,
        })),
        billing: {
          email: customer.email,
          first_name: customer.firstName,
          last_name: customer.lastName,
          address_1: customer.address ?? "",
          city: customer.city ?? "",
          phone: customer.phone ?? "",
          country: "TN",
        },
      }),
    });

    return NextResponse.json({
      orderId: order.id,
      orderKey: order.order_key,
      paymentUrl: order.checkout_payment_url,
      total: order.total,
    });
  } catch (err) {
    console.error("[POST /api/cart]", err);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}

// ─── DELETE /api/cart ─────────────────────────────────────────────────────────
// Cancels a pending order. Body: { orderId: number }

export async function DELETE(request: NextRequest) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required." }, { status: 400 });
    }

    await wcFetch(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled" }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/cart]", err);
    return NextResponse.json(
      { error: "Failed to cancel order." },
      { status: 500 }
    );
  }
}