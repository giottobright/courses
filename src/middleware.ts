// Middleware for protected routes
// This middleware runs before every request to check authentication

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/learn', '/certificates'];

// Admin-only routes
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For now, we'll use a cookie to check authentication
  // In production, this will be handled by Memberstack
  const memberstackAuth = request.cookies.get('_ms-mem');

  if (isProtectedRoute || isAdminRoute) {
    // If no Memberstack auth cookie, redirect to login
    if (!memberstackAuth) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Verify Memberstack token and check admin role for admin routes
    // This will be implemented when Memberstack SDK is integrated
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
