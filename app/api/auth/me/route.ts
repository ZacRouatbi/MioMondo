import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mio_auth_token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.WC_URL}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const userRes = await fetch(`${process.env.WC_URL}/wp-json/wp/v2/users/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    
    const userData = await userRes.json();
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar_urls['96']
      }
    });

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}