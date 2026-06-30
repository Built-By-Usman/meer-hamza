import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory rate limiter fallback for local development / serverless edge runtime warm-starts
const ipCache = new Map<string, { count: number; resetTime: number }>();

function checkInMemoryRateLimit(ip: string): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const limit = 20;

  const data = ipCache.get(ip);
  if (!data || now > data.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return { success: true, limit, remaining: limit - 1, reset: Math.ceil(windowMs / 1000) };
  }

  if (data.count >= limit) {
    const retryAfter = Math.ceil((data.resetTime - now) / 1000);
    return { success: false, limit, remaining: 0, reset: retryAfter };
  }

  data.count += 1;
  return { success: true, limit, remaining: limit - data.count, reset: Math.ceil((data.resetTime - now) / 1000) };
}

// Initialize Upstash Redis if environment credentials are provided
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
    });
  } catch (err) {
    console.error('Failed to initialize Upstash Redis ratelimiter:', err);
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Apply Rate Limiting to Auth API Routes (/api/auth/*)
  if (pathname.startsWith('/api/auth/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    if (ratelimit) {
      try {
        const { success, limit, reset, remaining } = await ratelimit.limit(ip);
        if (!success) {
          const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'Retry-After': String(retryAfter),
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(remaining),
            },
          });
        }
      } catch (err) {
        console.warn('Upstash rate limiting error, falling back to in-memory:', err);
        // Fallback to in-memory check if Upstash Redis call fails at runtime
        const { success, limit, remaining, reset } = checkInMemoryRateLimit(ip);
        if (!success) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'Retry-After': String(reset),
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(remaining),
            },
          });
        }
      }
    } else {
      // In-memory rate limiting check (no Upstash credentials configured)
      const { success, limit, remaining, reset } = checkInMemoryRateLimit(ip);
      if (!success) {
        return new NextResponse('Too Many Requests', {
          status: 429,
          headers: {
            'Retry-After': String(reset),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
          },
        });
      }
    }
  }

  // 2. Dynamic Content Security Policy (CSP) with Nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const apiDomain = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const cdnDomain = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.meerhamza.store';
  
  // Strict CSP Directive rules
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: images.unsplash.com ${cdnDomain} ${apiDomain};
    connect-src 'self' ${apiDomain};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  // Propagate nonce to layout via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Inject headers into response
  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
