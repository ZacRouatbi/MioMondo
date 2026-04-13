import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function getCache(key: string) {
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