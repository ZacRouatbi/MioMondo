import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

async function wcFetch(path: string) {
  const url = `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${wcAuth}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`WC ${res.status}`);
  return res.json();
}

// POST /api/cart/promo
// Body: { code: string }
// Returns: { valid: boolean, discountPercent?: number, message?: string }

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code?.trim()) {
      return NextResponse.json({ valid: false, message: "No code provided." }, { status: 400 });
    }

    const coupons = await wcFetch(`/coupons?code=${encodeURIComponent(code.trim())}`);

    if (!coupons?.length) {
      return NextResponse.json({ valid: false, message: "Promo code not found." });
    }

    const coupon = coupons[0];

    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return NextResponse.json({ valid: false, message: "This code has expired." });
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ valid: false, message: "This code has reached its usage limit." });
    }

    if (coupon.discount_type !== "percent") {
      return NextResponse.json({
        valid: false,
        message: "This code type is not supported online. Please use it in-store.",
      });
    }

    const discountPercent = parseFloat(coupon.amount);
    return NextResponse.json({ valid: true, discountPercent });
  } catch (err) {
    console.error("[POST /api/cart/promo]", err);
    return NextResponse.json({ valid: false, message: "Could not validate code." }, { status: 500 });
  }
}