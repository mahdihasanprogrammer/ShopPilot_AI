import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ---- Protected route prefixes (require authentication) ----
const PROTECTED_PREFIXES = ["/dashboard", "/checkout"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  // Fast cookie-based check — no DB hit, edge-compatible
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — role checks handled by client-side RouteGuard
  return NextResponse.next();
}

// Export default to satisfy Next.js 16 requirements completely
export default proxy;

export const config = {
  matcher: ["/dashboard/:path*", "/checkout"],
};
