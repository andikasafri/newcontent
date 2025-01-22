import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, refreshToken } from '@/lib/auth/jwt';

// Define protected routes that require authentication
const protectedRoutes = [
  '/account',
  '/checkout',
  '/admin',
];

// Define admin-only routes
const adminRoutes = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Get tokens from cookies
  const accessToken = request.cookies.get('access-token')?.value;
  const refreshTokenValue = request.cookies.get('refresh-token')?.value;

  // Allow public routes without authentication
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    if (accessToken) {
      // Verify access token
      const payload = await verifyToken(accessToken);

      // Check admin access for admin routes
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    }

    // Try to refresh the token
    if (refreshTokenValue) {
      try {
        const newAccessToken = await refreshToken(refreshTokenValue);
        const response = NextResponse.next();

        // Set new access token
        response.cookies.set({
          name: 'access-token',
          value: newAccessToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 // 15 minutes
        });

        return response;
      } catch {
        return redirectToLogin(request);
      }
    }

    return redirectToLogin(request);
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // Clear invalid tokens
  response.cookies.delete('access-token');
  response.cookies.delete('refresh-token');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};