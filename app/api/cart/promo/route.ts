import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { PromoCodeSchema } from "@/lib/validation-schemas";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

async function wcFetch(path: string) {
  const url = `${WC_URL.replace(/\/$/, "")}/wp-json/wc/v3${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: wcAuth(),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`WC ${res.status}`);
  }

  return res.json();
}
export async function POST(req: NextRequest) {
  try {
    const gate = await secureRequest(req as any, "public");
    if (!gate.ok) {
      return NextResponse.json(
        { valid: false, message: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 🔥 ZOD VALIDATION
    const parsed = PromoCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          message: "Invalid promo code format",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { code } = parsed.data;

    const coupons = await wcFetch(
      `/coupons?code=${encodeURIComponent(code.trim())}`
    );

    if (!Array.isArray(coupons) || !coupons.length) {
      return NextResponse.json({
        valid: false,
        message: "Promo code not found.",
      });
    }

    const coupon = coupons[0];

    if (
      coupon.date_expires &&
      new Date(coupon.date_expires) < new Date()
    ) {
      return NextResponse.json({
        valid: false,
        message: "This code has expired.",
      });
    }

    if (
      coupon.usage_limit &&
      coupon.usage_count >= coupon.usage_limit
    ) {
      return NextResponse.json({
        valid: false,
        message: "This code has reached its usage limit.",
      });
    }

    if (coupon.discount_type !== "percent") {
      return NextResponse.json({
        valid: false,
        message:
          "This code type is not supported online. Please use it in-store.",
      });
    }

    return NextResponse.json({
      valid: true,
      discountPercent: parseFloat(coupon.amount),
    });
  } catch (err) {
    return NextResponse.json(
      { valid: false, message: "Could not validate code." },
      { status: 500 }
    );
  }
}