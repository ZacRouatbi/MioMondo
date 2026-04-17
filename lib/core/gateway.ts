import { NextRequest } from "next/server";
import { rateLimitRequest } from "./rate-limit";  // ✅ matches the exported function name
import { ROUTE_POLICIES, RouteType } from "./policies";

export async function secureRequest(
  request: NextRequest,
  routeType: RouteType
) {
  const policy = ROUTE_POLICIES[routeType];

  // 1. Apply rate limiting
  const rateResult = await rateLimitRequest(
    request,
    policy.limit,
    policy.windowSec,
    policy.mode
  );

  // 2. Block if rate limit exceeded
  if (!rateResult.allowed) {
    return {
      ok: false,
      status: 429,
      message: "Too many requests",
      identity: rateResult.identity,
    };
  }

  // 3. Allow request to continue
  return {
    ok: true,
    identity: rateResult.identity,
    rateLimit: {
      key: rateResult.key,
    },
  };
}