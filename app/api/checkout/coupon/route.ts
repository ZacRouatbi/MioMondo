import { NextRequest, NextResponse } from "next/server";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const wcAuth = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")}`;

// POST /api/checkout/coupon
// Body: { code: string }
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code?.trim()) {
      return NextResponse.json({ message: "Code manquant" }, { status: 400 });
    }

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code.trim())}`,
      { headers: { Authorization: wcAuth } }
    );

    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      return NextResponse.json({ message: "Code promo invalide ou expiré" }, { status: 404 });
    }

    const coupon = data[0];

    // Check expiry
    if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
      return NextResponse.json({ message: "Ce code promo est expiré" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return NextResponse.json({ message: "Ce code promo a atteint sa limite d'utilisation" }, { status: 400 });
    }

    return NextResponse.json({
      code: coupon.code.toUpperCase(),
      discount_type: coupon.discount_type, // "percent" | "fixed_cart" | "fixed_product"
      amount: parseFloat(coupon.amount),
    });
  } catch (err: any) {
    console.error("[checkout/coupon]", err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}