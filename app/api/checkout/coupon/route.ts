import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { CouponSchema } from "@/lib/validation-schemas";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const wcAuth = `Basic ${Buffer.from(
  `${WC_KEY}:${WC_SECRET}`
).toString("base64")}`;

export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "coupon");

    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Too many coupon attempts" },
        { status: 429 }
      );
    }
    const body = await req.json();
    const parsed = CouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid coupon format",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { code } = parsed.data;
    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code)}`,
      {
        headers: {
          Authorization: wcAuth,
        },
      }
    );

    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      return NextResponse.json(
        { message: "Code promo invalide ou expiré" },
        { status: 404 }
      );
    }

    const coupon = data[0];
    if (
      coupon.date_expires &&
      new Date(coupon.date_expires) < new Date()
    ) {
      return NextResponse.json(
        { message: "Ce code promo est expiré" },
        { status: 400 }
      );
    }
    if (
      coupon.usage_limit &&
      coupon.usage_count >= coupon.usage_limit
    ) {
      return NextResponse.json(
        {
          message:
            "Ce code promo a atteint sa limite d'utilisation",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      code: coupon.code.toUpperCase(),
      discount_type: coupon.discount_type,
      amount: Number(coupon.amount),
    });

  } catch (err: any) {
    console.error("[checkout/coupon]", err);

    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}