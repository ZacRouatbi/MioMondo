import { NextRequest, NextResponse } from "next/server";
import { getCustomerIdFromToken } from "@/lib/auth-utils";
import { secureRequest } from "@/lib/core/gateway";
import { CustomerInfoSchema } from "@/lib/validation-schemas";

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
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
    const customerId = await getCustomerIdFromToken(req);
    if (!customerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "WC error" },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "account");

    if (!gateway.ok) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const customerId = await getCustomerIdFromToken(req);

    if (!customerId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = CustomerInfoSchema.safeParse({
      id: Number(customerId),
      ...body,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid customer data",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      billing: {
        phone: data.phone,
        address_1: data.address_1,
        city: data.city,
      },
      shipping: {
        first_name: data.first_name,
        last_name: data.last_name,
        address_1: data.address_1,
        city: data.city,
      },
    };

    const res = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Update failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}