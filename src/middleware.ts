import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { method, nextUrl } = request;
  const pathname = nextUrl.pathname;

  // Log request start
  console.log(`[HTTP] → ${method} ${pathname}`);

  // Allow login page
  if (pathname === "/admin/login") {
    const duration = Date.now() - start;
    console.log(`[HTTP] ← ${method} ${pathname} 200 (${duration}ms)`);
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const session = await getAdminSession();
    if (!session) {
      const duration = Date.now() - start;
      console.log(`[HTTP] ← ${method} ${pathname} 302 redirect (${duration}ms)`);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const response = NextResponse.next();
  const duration = Date.now() - start;
  console.log(`[HTTP] ← ${method} ${pathname} ${response.status} (${duration}ms)`);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
