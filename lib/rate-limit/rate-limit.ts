import { redis } from "../redis";

const memoryMap = new Map<string, { count: number; reset: number }>();

export async function checkRateLimit(
  key: string,
  limit =5,
  windowSec = 60
): Promise<boolean> {
  if (redis) {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSec);
    }

    return current <= limit;
  }

  const now = Date.now();
  const record = memoryMap.get(key);

  if (!record || now > record.reset) {
    memoryMap.set(key, {
      count: 1,
      reset: now + windowSec * 1000,
    });
    return true;
  }

  if (record.count < limit) {
    record.count++;
    return true;
  }

  return false;
}