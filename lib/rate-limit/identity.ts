import { NextRequest } from "next/server";
import { getClientIp } from "./request";
import { getUserIdFromRequest } from "../auth/get-user-id";

export async function getRateLimitIdentity(request: NextRequest) {
  const ip = getClientIp(request);
  const userId = await getUserIdFromRequest(request);

  return {
    ip,
    userId,

    key: userId ? `user:${userId}` : `ip:${ip}`,

    hybridKey: userId
      ? `ip:${ip}:user:${userId}`
      : `ip:${ip}`,
  };
}