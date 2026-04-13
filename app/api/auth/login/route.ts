import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Gateway protection (rate limiting / abuse control)
    const gateway = await secureRequest(req as any, "login");

    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    // 3. WooCommerce JWT login
    const wpRes = await fetch(
      `${process.env.WC_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
        }),
      }
    );

    const data = await wpRes.json();

    if (!wpRes.ok) {
      return NextResponse.json(
        { message: data.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Set secure cookie
    const cookieStore = await cookies();

    cookieStore.set("mio_auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        email: data.user_email,
        name: data.user_display_name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Connection to Sousse server failed" },
      { status: 500 }
    );
  }
}