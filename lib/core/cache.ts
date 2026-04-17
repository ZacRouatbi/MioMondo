import { redis } from "../redis";

export async function getCache(key: string) {
  if (!redis) return null;

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  value: any,
  ttlSeconds = 3600
) {
  if (!redis) return;

  try {
    await redis.set(
      key,
      JSON.stringify(value),
      "EX",
      ttlSeconds
    );
  } catch {
  }
}