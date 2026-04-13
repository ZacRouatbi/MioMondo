import { NextRequest, NextResponse } from "next/server";
import { getCustomerIdFromToken } from "@/lib/auth-utils";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return (
    "Basic " +
    Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64")
  );
}
const PasswordChangeSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  next: z.string().min(6, "New password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const gateway = await secureRequest(req as any, "account");
    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }
    const customerId = await getCustomerIdFromToken(req);
    if (!customerId) {
      return NextResponse.json(
        { message: "Session expirée" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const parsed = PasswordChangeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { current, next } = parsed.data;
    const customerRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!customerRes.ok) {
      return NextResponse.json(
        { message: "Données client introuvables" },
        { status: 404 }
      );
    }

    const customer = await customerRes.json();
    const verifyRes = await fetch(
      `${WC_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: customer.email,
          password: current,
        }),
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json(
        { message: "Mot de passe actuel incorrect" },
        { status: 403 }
      );
    }
    const updateRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: next }),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la mise à jour" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}