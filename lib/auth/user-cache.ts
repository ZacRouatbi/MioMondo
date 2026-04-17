import { redis } from "../redis";

const CACHE_TTL = 60 * 10; 

export async function getCachedUser(token: string) {
  const key = `auth:user:${token}`;
  
  // Use ?. to safely call .get()
  const cached = await redis?.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }

  return null;
}

export async function setCachedUser(token: string, user: any) {
  const key = `auth:user:${token}`;

  // Only call .set() if redis exists
  await redis?.set(key, JSON.stringify(user), "EX", CACHE_TTL);
}