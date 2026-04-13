import { NextRequest, NextResponse } from "next/server";
import { getCustomerIdFromToken } from "@/lib/auth-utils";
import { secureRequest } from "@/lib/core/gateway";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return (
    "Basic " +
    Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
  );
}

export async function GET(req: NextRequest) {
  try {
    // 🚦 GATEWAY (rate limit protection)
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // 🔐 AUTH
    const customerId = await getCustomerIdFromToken(req);
    if (!customerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/orders?customer=${customerId}&per_page=8&page=${page}&orderby=date&order=desc`,
      {
        headers: {
          Authorization: wcAuth(),
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "WC error" },
        { status: res.status }
      );
    }

    const orders = await res.json();

    const totalPages = parseInt(
      res.headers.get("X-WP-TotalPages") || "1",
      10
    );

    return NextResponse.json({
      orders,
      totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}