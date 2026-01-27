import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/static/')
  ) {
    return NextResponse.next();
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|static|.*\\..*$).*)',
  ],
}; 