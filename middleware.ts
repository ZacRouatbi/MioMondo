import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (ip === "unknown") {
    return new NextResponse("Blocked", { status: 403 });
  }
  const isApi = url.startsWith("/api");

  if (isApi) {
    const userAgent = req.headers.get("user-agent") || "";
    if (!userAgent || userAgent.length < 10) {
      return new NextResponse("Bot detected", { status: 403 });
    }
  }
  const res = NextResponse.next();

  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (url.startsWith("/products") || url === "/") {
    res.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return res;
}

export const config = {
  matcher: ["/", "/products/:path*", "/api/:path*"],
};