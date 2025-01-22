import { NextRequest, NextResponse } from 'next/server';

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // per window

interface RateLimit {
  timestamp: number;
  count: number;
}

const rateLimits = new Map<string, RateLimit>();

export function getRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const rateLimit = rateLimits.get(ip);

  if (!rateLimit) {
    rateLimits.set(ip, { timestamp: now, count: 1 });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (now - rateLimit.timestamp > WINDOW_SIZE) {
    rateLimits.set(ip, { timestamp: now, count: 1 });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (rateLimit.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }

  rateLimit.count++;
  return { ok: true, remaining: MAX_REQUESTS - rateLimit.count };
}

export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const rateLimit = getRateLimit(ip);

  if (!rateLimit.ok) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + 60).toString()
      }
    });
  }

  return null;
}