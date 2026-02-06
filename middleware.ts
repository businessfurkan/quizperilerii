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
    
    // 2. Secret Admin Route Logic
    // Check if the path starts with the secret admin route
    return NextResponse.next();
  },
  {
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
