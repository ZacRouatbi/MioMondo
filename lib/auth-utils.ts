import { NextRequest } from "next/server";
/**
 * Extract customer ID from authentication token
 * Safely gets customer ID from mio_auth_token cookie
 * 
 * @param request NextRequest object
 * @returns Customer ID if authenticated, null otherwise
 */
export async function getCustomerIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;

    const tokenMatch = cookieHeader.match(/mio_auth_token=([^;]+)/);
    if (!tokenMatch || !tokenMatch[1]) return null;

    const token = tokenMatch[1];
    const wc_url = process.env.WC_URL;
    if (!wc_url) {
      console.error("WC_URL not configured");
      return null;
    }

    const validationRes = await fetch(
      `${wc_url}/wp-json/jwt-auth/v1/token/validate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!validationRes.ok) return null;
    const userRes = await fetch(`${wc_url}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) return null;

    const userData = await userRes.json();
    return String(userData.id);
  } catch (error) {
    console.error("Failed to extract customer ID from token:", error);
    return null;
  }
}

