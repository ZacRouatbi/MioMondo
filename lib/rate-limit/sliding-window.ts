import { redis } from "../redis";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;

  // Redis key for this user/ip
  const redisKey = `rate:${key}`;

  // 1. Add current request
  await redis.zadd(redisKey, now, `${now}`);

  // 2. Remove old requests outside window
  await redis.zremrangebyscore(redisKey, 0, windowStart);

  // 3. Count requests in window
  const count = await redis.zcard(redisKey);

  // 4. Set expiry so Redis auto-cleans unused keys
  await redis.expire(redisKey, windowSec);

  // 5. Allow or block
  return count <= limit;
}