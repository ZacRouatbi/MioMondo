import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { secureRequest } from "@/lib/core/gateway";
import { getCache, setCache } from "@/lib/core/cache";

export async function GET(req: Request) {
  try {
    const gateway = await secureRequest(req as any, "account");

    if (!gateway.ok) {
      return NextResponse.json(
        { authenticated: false },
        { status: gateway.status || 429 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("mio_auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const cacheKey = `auth:me:${token}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }
    const response = await fetch(
      `${process.env.WC_URL}/wp-json/wp/v2/users/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const userData = await response.json();

    const result = {
      authenticated: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar_urls?.["96"],
      },
    };
    await setCache(cacheKey, result, 600);

    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}