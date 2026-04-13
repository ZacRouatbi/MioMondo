import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { secureRequest } from "@/lib/core/gateway";
import { z } from "zod";


const SignupSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
});

export async function POST(req: Request) {
  try {
    const gateway = await secureRequest(req as any, "auth");

    if (!gateway.ok) {
      return NextResponse.json(
        { message: "Too many signup attempts" },
        { status: 429 }
      );
    }
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const auth = Buffer.from(
      `${process.env.WC_KEY}:${process.env.WC_SECRET}`
    ).toString("base64");
    const wcRes = await fetch(
      `${process.env.WC_URL}/wp-json/wc/v3/customers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          email,
          password,
          first_name: email.split("@")[0],
          last_name: "Customer",
          role: "customer",
        }),
      }
    );

    const customer = await wcRes.json();

    if (!wcRes.ok) {
      return NextResponse.json(
        { message: customer.message || "Signup failed" },
        { status: 400 }
      );
    }
    const tokenRes = await fetch(
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

    const tokenData = await tokenRes.json();
    if (tokenRes.ok) {
      const cookieStore = await cookies();

      cookieStore.set("mio_auth_token", tokenData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.first_name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Signup error" },
      { status: 500 }
    );
  }
}