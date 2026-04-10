import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WC_URL = process.env.WC_URL!;
const MIO_BASE = `${WC_URL}/wp-json/mio/v1/wishlist`;

export async function GET() {
  const token = (await cookies()).get("mio_auth_token")?.value;
  if (!token) return NextResponse.json([]);

  const res = await fetch(`${MIO_BASE}/get`, {
    headers: { "Authorization": `Bearer ${token}`, "Cache-Control": "no-cache" },
  });
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("mio_auth_token")?.value;
  const { productId } = await req.json();

  const res = await fetch(`${MIO_BASE}/add`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  return NextResponse.json(await res.json());
}

export async function DELETE(req: NextRequest) {
  const token = (await cookies()).get("mio_auth_token")?.value;
  
  // We read from searchParams because your hook uses ?productId=...
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  const res = await fetch(`${MIO_BASE}/remove`, {
    method: "POST", // Calling the PHP remove route via POST
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ productId: Number(productId) }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}