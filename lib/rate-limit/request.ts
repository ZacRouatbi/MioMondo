import { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const ip =
    forwarded?.split(",")[0].trim() ||
    realIp ||
    "unknown";

  return ip;
}