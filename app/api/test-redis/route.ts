import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitRequest } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { allowed, identity } = await checkRateLimitRequest(
    request,
    5,
    60
  );

  return NextResponse.json({
    allowed,
    identity,
  });
}