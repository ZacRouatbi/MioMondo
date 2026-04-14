import { NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";
import { sendResetEmail } from "@/lib/email/sendResetEmail";
import { SignJWT } from "jose";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const JWT_SECRET = new TextEncoder().encode(process.env.RESET_TOKEN_SECRET!);

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

const ResetSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
});

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export async function POST(req: Request) {
  try {
    const gateway = await secureRequest(req as any, "auth");
    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Trop de tentatives. Réessayez plus tard." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ResetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Adresse e-mail invalide.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Always return ok to avoid account enumeration
    const searchRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}&role=customer`,
      { headers: { Authorization: wcAuth() }, cache: "no-store" }
    );

    if (!searchRes.ok) return NextResponse.json({ ok: true });

    const customers = await searchRes.json();
    if (!Array.isArray(customers) || customers.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const customer = customers[0];
    const newPassword = generatePassword();

    // Sign a short-lived JWT containing the pending password + customer id.
    // The password is NOT applied to WooCommerce yet — only after the user
    // clicks "Copier & Activer" in the email (hits /api/auth/reset-password/confirm).
    const token = await new SignJWT({
      customerId: customer.id,
      email,
      newPassword,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    await sendResetEmail({
      to: email,
      firstName: customer.first_name || "Client",
      newPassword,
      token,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}