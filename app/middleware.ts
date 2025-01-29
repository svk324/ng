// File: src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // Redirect to dashboard if already authenticated
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Update the config to protect all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
