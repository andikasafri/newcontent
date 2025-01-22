import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_COOKIE = 'csrf-token';

export function generateCsrfToken() {
  return nanoid(32);
}

export function validateCsrfToken(token: string, storedToken: string) {
  return token === storedToken;
}

export function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET requests
  if (request.method === 'GET') {
    return null;
  }

  const csrfToken = request.headers.get(CSRF_HEADER);
  const storedToken = request.cookies.get(CSRF_COOKIE)?.value;

  if (!csrfToken || !storedToken || !validateCsrfToken(csrfToken, storedToken)) {
    return new NextResponse('Invalid CSRF Token', { status: 403 });
  }

  return null;
}