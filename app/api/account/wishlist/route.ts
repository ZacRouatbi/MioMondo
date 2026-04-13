import { NextRequest, NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";
import { cookies } from "next/headers";

const WC_URL = process.env.WC_URL!;
const MIO_BASE = `${WC_URL}/wp-json/mio/v1/wishlist`;
const WishlistAddSchema = z.object({
  productId: z.number().int().positive("Invalid productId"),
});
const WishlistDeleteSchema = z.object({
  productId: z.coerce.number().int().positive("Invalid productId"),
});
async function getToken() {
  return (await cookies()).get("mio_auth_token")?.value;
}
export async function GET(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json([], { status: 429 });
    }

    const token = await getToken();
    if (!token) return NextResponse.json([], { status: 401 });

    const res = await fetch(`${MIO_BASE}/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json([]);
  }
}
export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const parsed = WishlistAddSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    const res = await fetch(`${MIO_BASE}/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const parsed = WishlistDeleteSchema.safeParse({
      productId: searchParams.get("productId"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid productId",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { productId } = parsed.data;

    const res = await fetch(`${MIO_BASE}/remove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}