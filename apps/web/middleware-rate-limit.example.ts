/**
 * Rate limiting example — middleware com limite de requisições.
 *
 * Este arquivo demonstra como implementar rate limiting no middleware
 * usando Upstash Redis. Para usar em produção:
 *
 * 1. pnpm add @upstash/redis @upstash/ratelimit
 * 2. Configure UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN no .env
 * 3. Substitua o middleware.ts por este arquivo (ou integre)
 *
 * Documentação: https://upstash.com/blog/ratelimiting-nextjs
 */

/*
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em alguns segundos." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
*/
