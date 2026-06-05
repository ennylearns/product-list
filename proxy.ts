import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/signup'];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // We look for authjs.session-token as next-auth uses this by default in production.
  // In development, it uses __Secure-authjs.session-token for secure sites, but we'll 
  // just check for any session token to do an optimistic check.
  const hasSessionToken = request.cookies.has('authjs.session-token') || 
                          request.cookies.has('__Secure-authjs.session-token');

  if (isProtectedRoute && !hasSessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && hasSessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
