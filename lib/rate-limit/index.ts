import { NextRequest } from "next/server";
import { checkRateLimit as slidingLimit } from "./sliding-window";
import { getRateLimitIdentity } from "./identity";

export async function checkRateLimitRequest(
  request: NextRequest,
  limit: number,
  windowSec: number,
  mode: "normal" | "strict" = "normal"
) {
  const identity = await getRateLimitIdentity(request);

  const key =
    mode === "strict"
      ? identity.hybridKey
      : identity.key;

  const allowed = await slidingLimit(
    key,
    limit,
    windowSec
  );

  return {
    allowed,
    identity,
    keyUsed: key
  };
}