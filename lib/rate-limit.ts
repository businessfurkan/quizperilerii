export interface RateLimitContext {
  ip: string;
  limit: number;
  windowMs: number;
}

const rateLimitMap = new Map<string, { count: number; expires: number }>();

export function rateLimit({ ip, limit, windowMs }: RateLimitContext): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean up expired entries (simple optimization)
  if (record && now > record.expires) {
    rateLimitMap.delete(ip);
  }

  if (!record || now > record.expires) {
    rateLimitMap.set(ip, {
      count: 1,
      expires: now + windowMs,
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

// Cleanup interval (every 10 minutes)
if (typeof global.setInterval === 'function') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.expires) {
                rateLimitMap.delete(key);
            }
        }
    }, 10 * 60 * 1000); 
}
