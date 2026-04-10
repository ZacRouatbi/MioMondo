import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const auth = Buffer.from(`${process.env.WC_KEY}:${process.env.WC_SECRET}`).toString("base64");
    const wcRes = await fetch(`${process.env.WC_URL}/wp-json/wc/v3/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      email: email,
      password: password,
      first_name: email.split('@')[0], 
      last_name: "Customer",
      role: "customer"
    }),
});
    const customer = await wcRes.json();
    if (!wcRes.ok) throw new Error(customer.message);
    const tokenRes = await fetch(`${process.env.WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const tokenData = await tokenRes.json();

    if (tokenRes.ok) {

      const cookieStore = await cookies();
      cookieStore.set("mio_auth_token", tokenData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    return NextResponse.json({ success: true, user: customer });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}