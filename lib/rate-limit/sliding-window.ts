import { redis } from "../redis";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  // Guard: If Redis is missing, allow the request to proceed (Fail open)
  if (!redis) {
    return true; 
  }

  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const redisKey = `rate:${key}`;

  try {
    // We use a pipeline or multi to make this efficient
    const pipeline = redis.pipeline();

    // 1. Add current request
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`); // Added random suffix to prevent key collision if hits happen in the same ms

    // 2. Remove old requests outside window
    pipeline.zremrangebyscore(redisKey, 0, windowStart);

    // 3. Count requests in window
    pipeline.zcard(redisKey);

    // 4. Set expiry
    pipeline.expire(redisKey, windowSec);

    const results = await pipeline.exec();
    
    // The 3rd command in the pipeline was zcard, so we check index 2
    // results[index] = [error, result]
    const count = results ? (results[2][1] as number) : 0;

    return count <= limit;
  } catch (error) {
    console.error("Rate limit error:", error);
    return true; // Still fail open if there's a connection error
  }
}