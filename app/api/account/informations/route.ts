import { NextRequest, NextResponse } from "next/server";

const WC_URL    = process.env.WC_URL!;
const WC_KEY    = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`${WC_URL}/wp-json/wc/v3/customers/${id}`, {
      headers: { 
        Authorization: wcAuth(),
        "Content-Type": "application/json",
      },
      cache: 'no-store' 
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "WC error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
    }

    const payload = {
      first_name: updateData.first_name,
      last_name: updateData.last_name,
      email: updateData.email,
      billing: {
        phone: updateData.phone,
        address_1: updateData.address_1,
        city: updateData.city,
      },
      shipping: {
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        address_1: updateData.address_1,
        city: updateData.city,
      }
    };

    const res = await fetch(`${WC_URL}/wp-json/wc/v3/customers/${id}`, {
      method: "PUT",
      headers: { 
        Authorization: wcAuth(), 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.message || "Update failed" }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}