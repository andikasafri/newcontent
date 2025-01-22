import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, refreshToken } from '@/lib/auth/jwt';

export async function middleware(request: NextRequest) {
  // Exclude public paths from authentication
  const publicPaths = ['/login', '/register', '/', '/products', '/categories'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Get tokens from cookies
  const accessToken = request.cookies.get('access-token')?.value;
  const refreshTokenValue = request.cookies.get('refresh-token')?.value;

  // Allow public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Verify access token
    if (accessToken) {
      const verified = await verifyToken(accessToken);
      
      // Check user role for admin routes
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (verified.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      // Valid token, proceed
      return NextResponse.next();
    }

    // Try to refresh token
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
      } catch (error) {
        // Refresh token invalid/expired
        return redirectToLogin(request);
      }
    }

    // No tokens available
    return redirectToLogin(request);
  } catch (error) {
    // Token verification failed
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