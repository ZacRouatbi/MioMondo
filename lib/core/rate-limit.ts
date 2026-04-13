import { checkRateLimit as sliding } from "../rate-limit/sliding-window";
import { getRateLimitIdentity } from "./identity";

export async function rateLimitRequest(
  request: any,
  limit: number,
  windowSec: number,
  mode: "normal" | "strict" = "normal"
) {
  const identity = await getRateLimitIdentity(request);

  const key =
    mode === "strict"
      ? identity.hybridKey
      : identity.key;

  const allowed = await sliding(key, limit, windowSec);

  return {
    allowed,
    key,
    identity,
  };
}