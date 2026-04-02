import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Hit the JWT Plugin endpoint
    const wpRes = await fetch(`${process.env.WC_URL}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email, // The plugin uses 'username' but accepts email
        password: password,
      }),
    });

    const data = await wpRes.json();

    // 2. Handle Errors (e.g., [jwt_auth] invalid_username)
    if (!wpRes.ok) {
      return NextResponse.json(
        { message: data.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3. Set the Secure Cookie with the 'data.token'
    const cookieStore = await cookies();
    cookieStore.set("mio_auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        email: data.user_email,
        name: data.user_display_name,
      }
    });

  } catch (error) {
    return NextResponse.json({ message: "Connection to Sousse server failed" }, { status: 500 });
  }
}