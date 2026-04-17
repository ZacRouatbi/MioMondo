import { redis } from "../redis";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  if (!redis) {
    return true; // Fail open if Redis unavailable
  }

  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  const redisKey = `rate:${key}`;

  try {
    const pipeline = redis.pipeline();

   
    pipeline.zremrangebyscore(redisKey, 0, windowStart - 1);

   
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);

    
    pipeline.zcount(redisKey, windowStart, "+inf");

   
    pipeline.expire(redisKey, windowSec);

    const results = await pipeline.exec();

   
    const count = results ? (results[2][1] as number) : 0;

   
    return count <= limit;
  } catch (error) {
    console.error("Rate limit error:", error);
    return true; 
  }
}