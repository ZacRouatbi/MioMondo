import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import {
  CartItemsSchema,
  CheckoutFormSchema,
} from "@/lib/validation-schemas";
import { validateCartItems } from "@/lib/cart-validation";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

async function wcFetch(path: string, options: RequestInit = {}) {
  const url = `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: wcAuth(),
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    next: { revalidate: 30 }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WooCommerce ${res.status}: ${text}`);
  }

  return res.json();
}
export async function GET(req: NextRequest) {
  try {
    const gate = await secureRequest(req as any, "public");
    if (!gate.ok) {
      return NextResponse.json([], { status: 429 });
    }

    const ids = req.nextUrl.searchParams.get("ids");
    if (!ids) return NextResponse.json({ products: [] });

    const idList = ids
      .split(",")
      .map((s) => Number(s.trim()))
      .filter(Boolean);
    const parsed = CartItemsSchema.safeParse(
      idList.map((id) => ({
        id,
        quantity: 1,
      }))
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid cart data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const validation = await validateCartItems(parsed.data);

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Cart validation failed", issues: validation.errors },
        { status: 400 }
      );
    }

    const includeParam = idList
      .map((id) => `include[]=${id}`)
      .join("&");

    const raw = await wcFetch(
      `/products?${includeParam}&per_page=${idList.length}`
    );

    return NextResponse.json({
      products: raw.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images?.[0]?.src ?? null,
        stock_status: p.stock_status,
      })),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to validate cart items." },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const gate = await secureRequest(req as any, "checkout");
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutFormSchema.safeParse(body.customer);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid customer data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const customer = parsed.data;
    const items = body.items;

    if (!items?.length) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const order = await wcFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        status: "pending",
        currency: "TND",
        line_items: items.map((i: any) => ({
          product_id: i.id,
          ...(i.variationId
            ? { variation_id: i.variationId }
            : {}),
          quantity: i.quantity,
        })),
        billing: {
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          address_1: customer.address_1,
          city: customer.city,
          phone: customer.phone,
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
  } catch {
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const gate = await secureRequest(req as any, "checkout");
    if (!gate.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required." },
        { status: 400 }
      );
    }

    await wcFetch(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "cancelled" }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to cancel order." },
      { status: 500 }
    );
  }
}