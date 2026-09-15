/**
 * Minimal in-memory rate limiter for the admin login route.
 * Good enough for a single-instance deployment; swap for a Redis-backed
 * limiter if you scale to multiple serverless regions/instances.
 */
type Attempt = { count: number; resetAt: number };

const attempts = new Map<string, Attempt>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}
