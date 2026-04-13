import { NextResponse } from "next/server";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";
import { sendResetEmail } from "@/lib/email/sendResetEmail";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

const ResetSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
});

function generatePassword(length = 12): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
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

    // 1. Find the customer by email
    const searchRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}&role=customer`,
      {
        headers: { Authorization: wcAuth() },
        cache: "no-store",
      }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ ok: true });
    }

    const customers = await searchRes.json();
    if (!Array.isArray(customers) || customers.length === 0) {
      // Same: don't reveal that the account doesn't exist
      return NextResponse.json({ ok: true });
    }

    const customer = customers[0];
    const newPassword = generatePassword();

    // 2. Update the password via WooCommerce REST API
    const updateRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customer.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la réinitialisation. Réessayez." },
        { status: 500 }
      );
    }

    // 3. Send email with the new password
    await sendResetEmail({
      to: email,
      firstName: customer.first_name || "Client",
      newPassword,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}