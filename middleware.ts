import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export default withAuth(
  function middleware(req) {
    // 1. Rate Limiting Strategy
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    
    // Strict limit for login (5 attempts per 10 mins)
    if (req.nextUrl.pathname.startsWith("/gizli-yonetim-kapisi-2024/login")) {
      const isAllowed = rateLimit({
        ip,
        limit: 5,
        windowMs: 10 * 60 * 1000, // 10 minutes
      });
      
      if (!isAllowed) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
    
    const response = NextResponse.next();

    // Security Headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Login sayfasına her zaman erişim izni ver (zaten middleware matcher ile buraya düşüyor ama auth gerektirmez)
        if (req.nextUrl.pathname.startsWith("/gizli-yonetim-kapisi-2024/login")) {
          return true;
        }
        // Diğer tüm admin sayfaları için ADMIN rolü zorunlu
        return token?.role === "admin";
      },
    },
    pages: {
      signIn: "/gizli-yonetim-kapisi-2024/login",
    },
  }
);

export const config = {
  // We use a generic matcher here because the actual path is secret
  // Ideally, you would update this matcher if you change the secret path in code structure
  // But Next.js Middleware Matcher must be static strings.
  // So we will RENAME the admin folder to the secret name.
  matcher: ["/gizli-yonetim-kapisi-2024/:path*"],
};
