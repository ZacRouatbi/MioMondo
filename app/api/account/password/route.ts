import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WC_URL = process.env.WC_URL!;
const WC_KEY = process.env.WC_KEY!;
const WC_SECRET = process.env.WC_SECRET!;

const getAuthUrl = (endpoint: string) => 
  `${WC_URL}/wp-json/${endpoint}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`;

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mio_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Session expirée" }, { status: 401 });
    }

    const { current, next } = await req.json();
    const wpMeRes = await fetch(`${WC_URL}/wp-json/wp/v2/users/me`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Connection": "keep-alive" 
      },
    });

    if (!wpMeRes.ok) {
      return NextResponse.json({ message: "Utilisateur non identifié" }, { status: 401 });
    }

    const wpUserData = await wpMeRes.json();
    const customerId = wpUserData.id;
    const wcCustomerRes = await fetch(getAuthUrl(`wc/v3/customers/${customerId}`), {
      headers: { "Connection": "keep-alive" }
    });

    if (!wcCustomerRes.ok) {
      return NextResponse.json({ message: "Données client introuvables" }, { status: 404 });
    }

    const { email: userEmail } = await wcCustomerRes.json();
    const verifyRes = await fetch(`${WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userEmail, password: current }),
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ message: "Mot de passe actuel incorrect" }, { status: 403 });
    }
    const res = await fetch(getAuthUrl(`wc/v3/customers/${customerId}`), {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json",
        "X-HTTP-Method-Override": "PUT" 
      },
      body: JSON.stringify({ password: next }),
    });

    if (!res.ok) {
      return NextResponse.json({ message: "Erreur lors de la mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Password API Error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}