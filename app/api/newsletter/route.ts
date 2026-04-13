import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";

export async function POST(req: NextRequest) {
  try {
    // 🔐 GATEWAY (anti-spam protection)
    const gateway = await secureRequest(req as any, "public");

    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 🧼 NORMALIZE EMAIL
    const email = body?.email?.trim()?.toLowerCase();

    // 🧠 BASIC VALIDATION
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    const WP_ENDPOINT =
      `${process.env.WC_URL}/wp-json/mio/v1/subscribe`;

    // 📡 FORWARD TO WORDPRESS
    const response = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Subscription failed"
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}