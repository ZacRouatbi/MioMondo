import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const JWT_SECRET = new TextEncoder().encode(process.env.RESET_TOKEN_SECRET!);
const SITE_URL = process.env.SITE_URL ?? "https://miomondohome.com";

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

// GET /api/auth/reset-password/confirm?token=...
// Called when the user clicks "Copier & Activer" in the email.
// Verifies the signed token, applies the new password to WooCommerce,
// then redirects to /reset-success?p=<password> so the page can show
// the copy UI. The password is in the URL only for that one redirect —
// the page should NOT be indexable (noindex already set in metadata).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/reset-success?error=invalid`);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { customerId, newPassword } = payload as {
      customerId: number;
      newPassword: string;
    };

    // Apply the password — this is the ONE place it actually gets written
    const updateRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
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
      return NextResponse.redirect(`${SITE_URL}/reset-success?error=update`);
    }

    // Redirect to the success page, passing the password so the user can copy it.
    // Use a short-lived query param — the page itself should have noindex.
    const successUrl = new URL(`${SITE_URL}/reset-success`);
    successUrl.searchParams.set("p", newPassword);
    return NextResponse.redirect(successUrl.toString());
  } catch {
    // Token expired or tampered
    return NextResponse.redirect(`${SITE_URL}/reset-success?error=expired`);
  }
}