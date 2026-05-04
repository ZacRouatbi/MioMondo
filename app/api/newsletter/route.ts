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

    // 🧼 NORMALIZE EMAIL & NAME
    const email = body?.email?.trim()?.toLowerCase();
    const name = body?.name?.trim() || "";

    // 🧠 BASIC VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 400 }
      );
    }

    const WP_ENDPOINT = `${process.env.WC_URL}/wp-json/miomondo/v1/newsletter/subscribe`;

    // ⏱️ Timeout (10 seconds like PHP)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // 📡 FORWARD TO WORDPRESS WITH SECRET HEADER
      const response = await fetch(WP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Miomondo-Secret": process.env.WP_API_SECRET || "",
        },
        body: JSON.stringify({ email, name }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      // ✅ Success status codes (200, 201)
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: data.message || "Successfully subscribed",
        });
      }

      // 🔁 Handle "already subscribed" as success (same as PHP)
      if (data.code === "already_subscribed") {
        return NextResponse.json({
          success: true,
          message: "Already subscribed",
        });
      }

      // ❌ Other WordPress errors
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Subscription failed",
        },
        { status: response.status >= 400 && response.status < 500 ? 400 : 500 }
      );
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      // Network errors, DNS failures, timeouts, etc.
      console.error("Newsletter subscription network error:", fetchError);
      return NextResponse.json(
        {
          success: false,
          message: "Service unavailable",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    // Any other unexpected errors (JSON parsing, etc.)
    console.error("Newsletter subscription unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}