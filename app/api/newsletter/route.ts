import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const WP_ENDPOINT = `${process.env.WC_URL}/wp-json/mio/v1/subscribe`;

    const response = await fetch(WP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // MailPoet returns specific errors if user exists
      throw new Error(data.message || "Subscription failed");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}