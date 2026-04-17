import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn("⚠️ REDIS_URL is not defined in environment variables.");
}

// We create the instance only if the URL exists
export const redis = redisUrl ? new Redis(redisUrl) : undefined;

// Helper to check if redis is healthy before using it
export const isRedisReady = () => !!redis;