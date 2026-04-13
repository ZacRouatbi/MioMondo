import { NextRequest } from "next/server";
import { getCache, setCache } from "../core/cache";

export async function getUserIdFromRequest(request: NextRequest) {
  const token = request.cookies.get("mio_auth_token")?.value;
  if (!token) return null;

  const cacheKey = `auth:${token}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${process.env.WC_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const user = await res.json();

    const userId = String(user.id);
    await setCache(cacheKey, userId, 600);

    return userId;
  } catch {
    return null;
  }
}