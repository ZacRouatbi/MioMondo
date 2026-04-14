import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { z } from "zod";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;
const JWT_SECRET = new TextEncoder().encode(process.env.RESET_TOKEN_SECRET!);

function wcAuth() {
  return "Basic " + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
}

const UpdatePasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = UpdatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Données invalides.", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // 1. Verify and Extract the JWT Token
    let customerId: number;
    let tokenTimestamp: string;

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const data = payload as { customerId: number; lastModified: string };
      customerId = data.customerId;
      tokenTimestamp = data.lastModified;
    } catch (err) {
      return NextResponse.json(
        { message: "Le lien a expiré ou est invalide." },
        { status: 401 }
      );
    }

    // 2. FETCH CURRENT CUSTOMER TO CHECK FOR SINGLE-USE
    // We use 'cache: no-store' to ensure we get the real data from DB
    const checkRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      { headers: { Authorization: wcAuth() }, cache: "no-store" }
    );

    if (!checkRes.ok) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const currentCustomer = await checkRes.json();

    // KILL SWITCH: If the date_modified has changed since the token was created,
    // it means the password (or profile) was already updated.
    if (currentCustomer.date_modified !== tokenTimestamp) {
      return NextResponse.json(
        { message: "Ce lien a déjà été utilisé pour réinitialiser le mot de passe." },
        { status: 401 }
      );
    }

    // 3. Apply the NEW password to WooCommerce
    const updateRes = await fetch(
      `${WC_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: "PUT",
        headers: {
          Authorization: wcAuth(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password }),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      console.error("WooCommerce Error:", errorData);
      return NextResponse.json(
        { message: "Erreur lors de la mise à jour du mot de passe." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Votre mot de passe a été mis à jour avec succès." 
    });

  } catch (error) {
    console.error("Confirm Reset Error:", error);
    return NextResponse.json(
      { message: "Erreur serveur." }, 
      { status: 500 }
    );
  }
}